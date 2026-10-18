export function siteOrigin(
  value: string | undefined,
  production: boolean,
): string {
  if (!value && !production) return "http://localhost:3000";
  if (!value)
    throw new Error("NEXT_PUBLIC_SITE_URL is required for production builds");
  const url = new URL(value);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without credentials, path, query or fragment",
    );
  }
  return url.origin;
}
