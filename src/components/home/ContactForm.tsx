"use client";

import { useState, type FormEvent } from "react";

/**
 * Contact form. Like the original page it only confirms on the client; wire `onSubmit`
 * to your CRM, an API route or a form service before going live.
 */
export function ContactForm({ challenges }: { challenges: string[] }) {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <form noValidate onSubmit={onSubmit}>
      <div className="fl">
        <label htmlFor="ch">Which challenge sounds most like yours?</label>
        <select id="ch" name="challenge" defaultValue="Not sure yet">
          <option>Not sure yet</option>
          {challenges.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="fl">
        <label htmlFor="idea">What&apos;s happening today?</label>
        <textarea
          id="idea"
          name="message"
          placeholder="A few lines about your goal, your pilot, your data or your AI costs."
        />
      </div>
      <div className="two">
        <div className="fl">
          <label htmlFor="nm">Your name</label>
          <input id="nm" name="name" placeholder="Full name" autoComplete="name" />
        </div>
        <div className="fl">
          <label htmlFor="em">Work email</label>
          <input id="em" name="email" type="email" placeholder="name@company.com" autoComplete="email" />
        </div>
      </div>
      <div className="sub">
        <button className="btn" type="submit">
          Schedule a Technical Discovery Call
        </button>
        <small>Direct access to senior engineering leads &#183; Zero obligation</small>
      </div>
      <div className="done" role="status" hidden={!sent}>
        Thanks. An expert will reply within [one business day] to book your call.
      </div>
    </form>
  );
}
