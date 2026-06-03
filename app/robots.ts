import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/", 
        "/dashboard/admin", 
        "/dashboard/participant",
        "/pay/callback"
      ],
    },
    sitemap: "https://incuxai.com/sitemap.xml",
  };
}
