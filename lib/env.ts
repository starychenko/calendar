import { siteOrigin } from "./site-config";
export const SITE_URL = siteOrigin(
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NODE_ENV === "production",
);
