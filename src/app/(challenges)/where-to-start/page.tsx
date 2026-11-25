import { InnerPage, innerMetadata } from "@/components/inner/InnerPage";

export const metadata = innerMetadata("where-to-start");

export default function Page() {
  return <InnerPage slug="where-to-start" />;
}
