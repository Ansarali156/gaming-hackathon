import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aigaminghackathon.incuxai.com";
  
  const routes = [
    "",
    "/register",
    "/sponsors",
    "/sponsors/contact",
    "/login",
    "/privacy-policy",
    "/terms-of-service",
    "/refund-policy",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly" as any,
    priority: route === "" ? 1.0 : 0.8,
  }));
}
