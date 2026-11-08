export interface ServerBackendOriginOptions {
  configuredUrl?: string | null;
  isProduction?: boolean;
}

export function resolveServerBackendBaseUrl(
  options: ServerBackendOriginOptions = {},
): string {
  if (options.configuredUrl) {
    return options.configuredUrl.replace(/\/+$/, "");
  }
  return "";
}

export function getServerBackendBaseUrl(): string {
  return resolveServerBackendBaseUrl();
}
