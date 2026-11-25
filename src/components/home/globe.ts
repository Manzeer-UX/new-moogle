/**
 * Hero "intelligence globe".
 *
 * A dependency-free WebGL port of the original page's three.js r128 scene (which cost a
 * ~150 KB gzipped CDN script). Same scene graph, constants, colours, fog and motion:
 *   - 760 nodes on a Fibonacci sphere, each linked to its two nearest neighbours
 *   - 12 data arcs with travelling pulses and glows
 *   - 3 tilted orbit rings with satellites, a soft core glow, white fog for depth
 *   - pointer parallax, scroll drift, paused while the hero is off screen
 *
 * This module is loaded with a dynamic import after the page is idle, so it never
 * competes with first paint or hydration.
 */

type M4 = Float32Array;
type V3 = [number, number, number];

const R = 1.6;
const N = 760;
const FOV = (35 * Math.PI) / 180;
const CAM_Z = 9;
const FOG: [number, number] = [8.2, 11.2];

const A: V3 = hex("#e8613c");
const B: V3 = hex("#f2a93b");
const C2: V3 = hex("#c94a2a");

/** [radius x R, tube, tilt x, tilt y, opacity] */
const RINGS: [number, number, number, number, number][] = [
  [1.42, 0.006, 1.15, 0.35, 0.38],
  [1.68, 0.004, 1.35, -0.5, 0.22],
  [1.95, 0.003, 0.95, 0.9, 0.14],
];

function hex(h: string): V3 {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/* ---------------- tiny column-major mat4 helpers ---------------- */

function mul(a: M4, b: M4): M4 {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++)
      o[c * 4 + r] =
        a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
  return o;
}
function ident(): M4 {
  const m = new Float32Array(16);
  m[0] = m[5] = m[10] = m[15] = 1;
  return m;
}
function trans(x: number, y: number, z: number): M4 {
  const m = ident();
  m[12] = x;
  m[13] = y;
  m[14] = z;
  return m;
}
function scale(s: number): M4 {
  const m = ident();
  m[0] = m[5] = m[10] = s;
  return m;
}
function rotX(a: number): M4 {
  const m = ident(), c = Math.cos(a), s = Math.sin(a);
  m[5] = c; m[6] = s; m[9] = -s; m[10] = c;
  return m;
}
function rotY(a: number): M4 {
  const m = ident(), c = Math.cos(a), s = Math.sin(a);
  m[0] = c; m[2] = -s; m[8] = s; m[10] = c;
  return m;
}
function rotZ(a: number): M4 {
  const m = ident(), c = Math.cos(a), s = Math.sin(a);
  m[0] = c; m[1] = s; m[4] = -s; m[5] = c;
  return m;
}
/** three.js Euler order "XYZ" */
function euler(x: number, y: number, z: number): M4 {
  return mul(mul(rotX(x), rotY(y)), rotZ(z));
}
function persp(fovy: number, aspect: number, near: number, far: number): M4 {
  const f = 1 / Math.tan(fovy / 2), m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = (far + near) / (near - far);
  m[11] = -1;
  m[14] = (2 * far * near) / (near - far);
  return m;
}
function apply(m: M4, x: number, y: number, z: number): V3 {
  return [
    m[0] * x + m[4] * y + m[8] * z + m[12],
    m[1] * x + m[5] * y + m[9] * z + m[13],
    m[2] * x + m[6] * y + m[10] * z + m[14],
  ];
}

/* ---------------- shaders ---------------- */

const FOG_VARY = "uniform vec2 uFog; varying float vFog;";

/** Nodes, glows and solid discs, all drawn as point sprites. */
const PTS_VS = `
attribute vec3 aPos; attribute vec3 aCol; attribute float aSize; attribute float aAlpha;
uniform mat4 uMV; uniform mat4 uP; uniform float uK; ${FOG_VARY}
varying vec3 vCol; varying float vAlpha; varying float vSize;
void main(){
  vec4 p = uMV * vec4(aPos, 1.0);
  gl_Position = uP * p;
  gl_PointSize = aSize * uK / -p.z;
  vSize = gl_PointSize; vCol = aCol; vAlpha = aAlpha;
  vFog = smoothstep(uFog.x, uFog.y, -p.z);
}`;
const PTS_FS = `
precision mediump float;
uniform float uMode; varying vec3 vCol; varying float vAlpha; varying float vSize; varying float vFog;
void main(){
  float r = length(gl_PointCoord - 0.5) * 2.0;
  float a;
  if (uMode < 0.5) {
    // the original 64px radial-gradient sprite: solid to 45%, 0.35 at 60%, clear at the rim
    a = r < 0.45 ? 1.0 : (r < 0.6 ? mix(1.0, 0.35, (r - 0.45) / 0.15) : mix(0.35, 0.0, (r - 0.6) / 0.4));
    a *= step(r, 1.0);
  } else {
    a = 1.0 - smoothstep(1.0 - 2.0 / max(vSize, 1.0), 1.0, r);
  }
  a *= vAlpha;
  if (a < 0.02) discard;
  gl_FragColor = vec4(mix(vCol, vec3(1.0), vFog), a);
}`;

/** Lines, arcs and torus rings: one flat colour. */
const FLAT_VS = `
attribute vec3 aPos; uniform mat4 uMV; uniform mat4 uP; ${FOG_VARY}
void main(){ vec4 p = uMV * vec4(aPos, 1.0); gl_Position = uP * p; vFog = smoothstep(uFog.x, uFog.y, -p.z); }`;
const FLAT_FS = `
precision mediump float; uniform vec3 uColor; uniform float uOpacity; varying float vFog;
void main(){ gl_FragColor = vec4(mix(uColor, vec3(1.0), vFog), uOpacity); }`;

/** Camera-facing quad for the large core glow (too big for a point sprite). */
const GLOW_VS = `
attribute vec2 aCorner; uniform vec3 uCenter; uniform float uHalf; uniform mat4 uP; ${FOG_VARY}
varying vec2 vUv;
void main(){
  vUv = aCorner;
  gl_Position = uP * vec4(uCenter + vec3(aCorner * uHalf, 0.0), 1.0);
  vFog = smoothstep(uFog.x, uFog.y, -uCenter.z);
}`;
const GLOW_FS = `
precision mediump float; varying vec2 vUv; varying float vFog;
void main(){
  float r = length(vUv);
  vec3 c0 = vec3(0.949, 0.663, 0.231), c1 = vec3(0.937, 0.490, 0.227), c2 = vec3(0.910, 0.380, 0.235);
  vec3 c; float a;
  if (r < 0.35) { float t = r / 0.35; c = mix(c0, c1, t); a = mix(0.55, 0.22, t); }
  else { float t = clamp((r - 0.35) / 0.65, 0.0, 1.0); c = mix(c1, c2, t); a = mix(0.22, 0.0, t); }
  if (a <= 0.0) discard;
  gl_FragColor = vec4(mix(c, vec3(1.0), vFog), a);
}`;

/* ---------------- geometry ---------------- */

function fibonacciSphere() {
  const V: V3[] = [];
  const nodes = new Float32Array(N * 8); // pos3 col3 size alpha
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
    const v: V3 = [Math.cos(th) * r * R, y * R, Math.sin(th) * r * R];
    V.push(v);
    const t = (y + 1) / 2;
    const c: V3 = Math.random() < 0.12 ? C2 : [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t];
    nodes.set([v[0], v[1], v[2], c[0], c[1], c[2], 0.06, 1], i * 8);
  }
  return { V, nodes };
}

/** Link every node to its two nearest neighbours. Nodes are sorted by y, so the search
 *  can stop as soon as the vertical gap alone exceeds the current second-best distance. */
function meshLines(V: V3[]) {
  const out: number[] = [];
  const d2 = (a: V3, b: V3) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
  for (let i = 0; i < N; i++) {
    let b0 = Infinity, j0 = -1, b1 = Infinity, j1 = -1;
    for (const dir of [-1, 1]) {
      for (let j = i + dir; j >= 0 && j < N; j += dir) {
        const dy = V[j][1] - V[i][1];
        if (dy * dy >= b1) break;
        const d = d2(V[i], V[j]);
        if (d < b1) {
          if (d < b0) { b1 = b0; j1 = j0; b0 = d; j0 = j; } else { b1 = d; j1 = j; }
        }
      }
    }
    for (const j of [j0, j1]) if (j > i) out.push(...V[i], ...V[j]);
  }
  return new Float32Array(out);
}

function angle(a: V3, b: V3) {
  const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  return Math.acos(Math.min(1, Math.max(-1, dot / (Math.hypot(...a) * Math.hypot(...b)))));
}

function bezier(a: V3, m: V3, b: V3, t: number): V3 {
  const u = 1 - t;
  return [
    u * u * a[0] + 2 * u * t * m[0] + t * t * b[0],
    u * u * a[1] + 2 * u * t * m[1] + t * t * b[1],
    u * u * a[2] + 2 * u * t * m[2] + t * t * b[2],
  ];
}

function torus(radius: number, tube: number, radial = 8, tubular = 220) {
  const pos: number[] = [], idx: number[] = [];
  for (let j = 0; j <= radial; j++)
    for (let i = 0; i <= tubular; i++) {
      const u = (i / tubular) * Math.PI * 2, v = (j / radial) * Math.PI * 2;
      pos.push((radius + tube * Math.cos(v)) * Math.cos(u), (radius + tube * Math.cos(v)) * Math.sin(u), tube * Math.sin(v));
    }
  for (let j = 1; j <= radial; j++)
    for (let i = 1; i <= tubular; i++) {
      const a = (tubular + 1) * j + i - 1, b = (tubular + 1) * (j - 1) + i - 1;
      const c = (tubular + 1) * (j - 1) + i, d = (tubular + 1) * j + i;
      idx.push(a, b, d, b, c, d);
    }
  return { pos: new Float32Array(pos), idx: new Uint16Array(idx) };
}

/* ---------------- WebGL plumbing ---------------- */

function program(gl: WebGLRenderingContext, vs: string, fs: string) {
  const p = gl.createProgram()!;
  for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]] as const) {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
    gl.attachShader(p, s);
  }
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || "link");
  const u = (n: string) => gl.getUniformLocation(p, n);
  const a = (n: string) => gl.getAttribLocation(p, n);
  return { p, u, a };
}

type Prog = ReturnType<typeof program>;

function buffer(gl: WebGLRenderingContext, data: BufferSource, target: number = gl.ARRAY_BUFFER, usage: number = gl.STATIC_DRAW) {
  const b = gl.createBuffer()!;
  gl.bindBuffer(target, b);
  gl.bufferData(target, data, usage);
  return b;
}

/* ---------------- mount ---------------- */

export function mountGlobe(canvas: HTMLCanvasElement): () => void {
  const hero = canvas.parentElement as HTMLElement;
  const picker = hero.querySelector<HTMLElement>(".picker");
  const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: "low-power" });
  if (!gl) return () => {};

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // On phones the globe sits at 38% opacity behind the text: 1.5x is visually identical and cheaper.
  const dpr = Math.min(window.innerWidth < 900 ? 1.5 : 2, window.devicePixelRatio || 1);

  let pts: Prog, flat: Prog, glowP: Prog;
  try {
    pts = program(gl, PTS_VS, PTS_FS);
    flat = program(gl, FLAT_VS, FLAT_FS);
    glowP = program(gl, GLOW_VS, GLOW_FS);
  } catch {
    return () => {};
  }

  /* static scene */
  const { V, nodes } = fibonacciSphere();
  const nodeBuf = buffer(gl, nodes);
  const lines = meshLines(V);
  const lineBuf = buffer(gl, lines);

  const arcs: { a: V3; m: V3; b: V3; t: number; s: number; col: V3 }[] = [];
  const arcPts: [number[], number[]] = [[], []];
  for (let k = 0; k < 12; k++) {
    const a = V[(Math.random() * N) | 0];
    let b: V3;
    do b = V[(Math.random() * N) | 0];
    while (angle(a, b) < 0.7 || angle(a, b) > 2.2);
    const sum: V3 = [a[0] + b[0], a[1] + b[1], a[2] + b[2]], len = Math.hypot(...sum), k2 = (R * (1.3 + Math.random() * 0.25)) / len;
    const m: V3 = [sum[0] * k2, sum[1] * k2, sum[2] * k2];
    let prev = bezier(a, m, b, 0);
    for (let i = 1; i <= 60; i++) {
      const p = bezier(a, m, b, i / 60);
      arcPts[k % 2].push(...prev, ...p);
      prev = p;
    }
    arcs.push({ a, m, b, t: Math.random(), s: 0.0025 + Math.random() * 0.003, col: k % 2 ? B : A });
  }
  const arcBufs = arcPts.map((p) => ({ buf: buffer(gl, new Float32Array(p)), count: p.length / 3 }));

  const rings = RINGS.map(([rad, tube, rx, ry, op], i) => {
    const t = torus(R * rad, tube);
    return {
      pos: buffer(gl, t.pos),
      idx: buffer(gl, t.idx, gl.ELEMENT_ARRAY_BUFFER),
      count: t.idx.length,
      tilt: mul(rotX(rx), rotY(ry)),
      rad: R * rad,
      opacity: op,
      col: i ? B : A,
      satR: 0.05 - 0.01 * i,
      v: (0.004 - 0.001 * i) * (i % 2 ? -1 : 1),
      zRing: 0,
      zSat: 0,
    };
  });

  const quadBuf = buffer(gl, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]));
  const discData = new Float32Array(15 * 8);
  const discBuf = buffer(gl, discData, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
  const glowData = new Float32Array(12 * 8);
  const glowBuf = buffer(gl, glowData, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);

  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearColor(0, 0, 0, 0);

  /* layout */
  let W = 1, H = 1, P = persp(FOV, 1, 0.1, 100), focal = 1, gScale = 1;
  const base = { x: 0, y: 0 };

  function offsetIn(el: HTMLElement, root: HTMLElement) {
    let x = 0, y = 0, n: HTMLElement | null = el;
    while (n && n !== root) {
      x += n.offsetLeft;
      y += n.offsetTop;
      n = n.offsetParent as HTMLElement | null;
    }
    return { x, y };
  }

  function size() {
    W = hero.clientWidth;
    H = hero.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    gl!.viewport(0, 0, canvas.width, canvas.height);
    P = persp(FOV, W / H, 0.1, 100);
    focal = H / 2 / Math.tan(FOV / 2);
    const wpp = (2 * CAM_Z * Math.tan(FOV / 2)) / H; // world units per CSS pixel at z = 0
    if (picker && W >= 900) {
      // centre the globe behind the picker card, 70% across and 36% down
      const o = offsetIn(picker, hero);
      const cx = o.x + picker.offsetWidth * 0.7, cy = o.y + picker.offsetHeight * 0.36;
      base.x = (cx - W / 2) * wpp;
      base.y = -(cy - H / 2) * wpp;
      gScale = (picker.offsetHeight * 0.7 * wpp) / R;
    } else {
      base.x = (W * 0.82 - W / 2) * wpp;
      base.y = -(H * 0.12 - H / 2) * wpp;
      gScale = (Math.min(W, 520) * 0.42 * wpp) / R;
    }
    if (!running) render();
  }

  /* motion state */
  let mx = 0, my = 0, tx = 0, ty = 0, sy = 0, spin = 0, last = 0, raf = 0;
  let running = false, visible = true;

  function setAttribs(prog: Prog, buf: WebGLBuffer, layout: [string, number][], stride: number) {
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buf);
    let off = 0;
    for (const [name, n] of layout) {
      const loc = prog.a(name);
      if (loc >= 0) {
        gl!.enableVertexAttribArray(loc);
        gl!.vertexAttribPointer(loc, n, gl!.FLOAT, false, stride * 4, off * 4);
      }
      off += n;
    }
  }
  const PTS_LAYOUT: [string, number][] = [["aPos", 3], ["aCol", 3], ["aSize", 1], ["aAlpha", 1]];

  function disableAttribs() {
    for (let i = 0; i < 4; i++) gl!.disableVertexAttribArray(i);
  }

  function render() {
    const g = gl!;
    const view = trans(0, 0, -CAM_Z);
    const MG = mul(mul(trans(base.x, base.y + sy * 0.0012, 0), euler(0.18 + ty * 0.25, tx * 0.35, -0.12)), scale(gScale));
    const MSP = mul(MG, rotY(spin));
    const VSP = mul(view, MSP);

    // dynamic: pulses (12) + satellites (3), in world space
    arcs.forEach((a, i) => {
      const p = apply(MSP, ...bezier(a.a, a.m, a.b, a.t));
      discData.set([...p, ...a.col, 0.07 * gScale, 1], i * 8);
    });
    rings.forEach((r, i) => {
      const M = mul(mul(mul(MG, r.tilt), rotZ(r.zRing + r.zSat)), trans(r.rad, 0, 0));
      discData.set([...apply(M, 0, 0, 0), ...A, 2 * r.satR * gScale, 1], (12 + i) * 8);
    });
    // glows sorted into "behind the centre" and "in front", like three.js transparent sorting
    const centreZ = -CAM_Z;
    const glows = arcs.map((a) => {
      const p = apply(MSP, ...bezier(a.a, a.m, a.b, a.t));
      return { p, z: p[2] - CAM_Z, alpha: 0.6 * Math.sin(Math.PI * a.t) };
    });
    glows.sort((x, y) => x.z - y.z);
    const back = glows.filter((q) => q.z < centreZ).length;
    glows.forEach((q, i) => glowData.set([...q.p, ...B, 0.22 * gScale, q.alpha], i * 8));

    g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);

    // 1. opaque discs (write depth)
    g.useProgram(pts.p);
    g.uniformMatrix4fv(pts.u("uP"), false, P);
    g.uniform2fv(pts.u("uFog"), FOG);
    g.uniformMatrix4fv(pts.u("uMV"), false, view);
    g.uniform1f(pts.u("uK"), focal * dpr);
    g.uniform1f(pts.u("uMode"), 1);
    g.bindBuffer(g.ARRAY_BUFFER, discBuf);
    g.bufferSubData(g.ARRAY_BUFFER, 0, discData);
    setAttribs(pts, discBuf, PTS_LAYOUT, 8);
    g.depthMask(true);
    g.drawArrays(g.POINTS, 0, 15);
    disableAttribs();

    // 2. transparent, back to front
    g.depthMask(false);

    // core glow
    g.useProgram(glowP.p);
    g.uniformMatrix4fv(glowP.u("uP"), false, P);
    g.uniform2fv(glowP.u("uFog"), FOG);
    const gc = apply(mul(view, MG), 0, 0, -R * 0.6);
    g.uniform3fv(glowP.u("uCenter"), gc);
    g.uniform1f(glowP.u("uHalf"), R * 4.2 * gScale * 0.5);
    g.bindBuffer(g.ARRAY_BUFFER, quadBuf);
    const ac = glowP.a("aCorner");
    g.enableVertexAttribArray(ac);
    g.vertexAttribPointer(ac, 2, g.FLOAT, false, 0, 0);
    g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
    disableAttribs();

    // arc glows behind the centre
    g.useProgram(pts.p);
    g.uniform1f(pts.u("uMode"), 0);
    g.bindBuffer(g.ARRAY_BUFFER, glowBuf);
    g.bufferSubData(g.ARRAY_BUFFER, 0, glowData);
    setAttribs(pts, glowBuf, PTS_LAYOUT, 8);
    if (back) g.drawArrays(g.POINTS, 0, back);
    disableAttribs();

    // nodes
    g.uniformMatrix4fv(pts.u("uMV"), false, VSP);
    g.uniform1f(pts.u("uK"), dpr * H * 0.5); // three.js PointsMaterial size attenuation
    setAttribs(pts, nodeBuf, PTS_LAYOUT, 8);
    g.drawArrays(g.POINTS, 0, N);
    disableAttribs();

    // mesh lines + arcs
    g.useProgram(flat.p);
    g.uniformMatrix4fv(flat.u("uP"), false, P);
    g.uniform2fv(flat.u("uFog"), FOG);
    g.uniformMatrix4fv(flat.u("uMV"), false, VSP);
    const ap = flat.a("aPos");
    g.enableVertexAttribArray(ap);
    g.uniform3fv(flat.u("uColor"), A);
    g.uniform1f(flat.u("uOpacity"), 0.22);
    g.bindBuffer(g.ARRAY_BUFFER, lineBuf);
    g.vertexAttribPointer(ap, 3, g.FLOAT, false, 0, 0);
    g.drawArrays(g.LINES, 0, lines.length / 3);
    arcBufs.forEach((arc, k) => {
      g.uniform3fv(flat.u("uColor"), k ? B : A);
      g.uniform1f(flat.u("uOpacity"), 0.42);
      g.bindBuffer(g.ARRAY_BUFFER, arc.buf);
      g.vertexAttribPointer(ap, 3, g.FLOAT, false, 0, 0);
      g.drawArrays(g.LINES, 0, arc.count);
    });

    // orbit rings (front faces only, as MeshBasicMaterial)
    g.enable(g.CULL_FACE);
    for (const r of rings) {
      g.uniformMatrix4fv(flat.u("uMV"), false, mul(mul(view, MG), r.tilt));
      g.uniform3fv(flat.u("uColor"), r.col);
      g.uniform1f(flat.u("uOpacity"), r.opacity);
      g.bindBuffer(g.ARRAY_BUFFER, r.pos);
      g.vertexAttribPointer(ap, 3, g.FLOAT, false, 0, 0);
      g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, r.idx);
      g.drawElements(g.TRIANGLES, r.count, g.UNSIGNED_SHORT, 0);
    }
    g.disable(g.CULL_FACE);
    disableAttribs();

    // arc glows in front of the centre
    if (back < 12) {
      g.useProgram(pts.p);
      g.uniformMatrix4fv(pts.u("uMV"), false, view);
      g.uniform1f(pts.u("uK"), focal * dpr);
      g.uniform1f(pts.u("uMode"), 0);
      setAttribs(pts, glowBuf, PTS_LAYOUT, 8);
      g.drawArrays(g.POINTS, back, 12 - back);
      disableAttribs();
    }
  }

  function frame(now: number) {
    const k = last ? Math.min((now - last) / (1000 / 60), 3) : 1; // 60 fps-equivalent steps
    last = now;
    const ease = 1 - Math.pow(0.95, k);
    tx += (mx - tx) * ease;
    ty += (my - ty) * ease;
    spin += 0.0016 * k;
    for (const a of arcs) a.t = (a.t + a.s * k) % 1;
    for (const r of rings) {
      r.zRing += r.v * 0.3 * k;
      r.zSat += r.v * 3 * k;
    }
    render();
    if (running) raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduce || !visible || document.hidden) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  const onScroll = () => {
    sy = Math.min(window.scrollY, 900); // picked up by the next frame
  };
  const onMove = (e: MouseEvent) => {
    const r = hero.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    my = ((e.clientY - r.top) / r.height) * 2 - 1;
  };
  const onLeave = () => {
    mx = my = 0;
  };
  const onVisibility = () => (document.hidden ? stop() : start());

  let resizeTimer = 0;
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(size, 150);
  });
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) start();
    else stop();
  });

  size();
  onScroll();
  render();
  canvas.classList.add("on");
  ro.observe(hero);
  io.observe(hero);
  window.addEventListener("scroll", onScroll, { passive: true });
  hero.addEventListener("mousemove", onMove);
  hero.addEventListener("mouseleave", onLeave);
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", stop);
  start();

  return () => {
    stop();
    ro.disconnect();
    io.disconnect();
    clearTimeout(resizeTimer);
    window.removeEventListener("scroll", onScroll);
    hero.removeEventListener("mousemove", onMove);
    hero.removeEventListener("mouseleave", onLeave);
    document.removeEventListener("visibilitychange", onVisibility);
    canvas.removeEventListener("webglcontextlost", stop);
    canvas.classList.remove("on");
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}
