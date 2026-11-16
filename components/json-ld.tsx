import { serializeJsonLd, type JsonLdData } from "@/lib/utils/json-ld";

/** Structured data for search engines and AI crawlers. Render it in a server component. */
export const JsonLd = ({ data }: { data: JsonLdData }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
};
