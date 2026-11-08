export interface ClientBackendOriginOptions {
  configuredUrl?: string | null;
  hostname?: string | null;
  isProduction?: boolean;
  hasWindow?: boolean;
}

export function resolveClientBackendBaseUrl(
  options: ClientBackendOriginOptions = {},
): string {
  if (options.configuredUrl) {
    return options.configuredUrl.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "";
}

export function getClientBackendBaseUrl(): string {
  return resolveClientBackendBaseUrl();
}
