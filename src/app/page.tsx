import { Capabilities } from "@/components/home/Capabilities";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { Lifecycle } from "@/components/home/Lifecycle";
import { OperatingModel } from "@/components/home/OperatingModel";
import { Platforms } from "@/components/home/Platforms";
import { Solutions } from "@/components/home/Solutions";
import { Talk } from "@/components/home/Talk";
import { Why } from "@/components/home/Why";
import { Work } from "@/components/home/Work";
import "./home.css";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <Work />
      <Platforms />
      <Lifecycle />
      <Why />
      <OperatingModel />
      <Solutions />
      <Talk />
      <Faq />
    </>
  );
}
