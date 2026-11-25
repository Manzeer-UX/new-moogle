import { InnerPage, innerMetadata } from "@/components/inner/InnerPage";

export const metadata = innerMetadata("data-engineering-services");

export default function Page() {
  return <InnerPage slug="data-engineering-services" />;
}
