import { BRAND } from "@/constants/app";
import { SITE_DESCRIPTION } from "@/constants/server";
import type { JsonLdData } from "@/lib/utils/json-ld";
import { getAbsoluteUrl } from "@/lib/utils/site-url";

/** WebSite and Organization for the home page: Google takes the site name in its results from the WebSite. */
export const getSiteJsonLd = (): JsonLdData => {
  const home = getAbsoluteUrl("/");
  const organizationId = `${home}#organization`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${home}#website`,
        url: home,
        name: BRAND,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": organizationId },
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        url: home,
        name: BRAND,
        logo: getAbsoluteUrl("/logo-emblem.png"),
      },
    ],
  };
};
