export const isProd = process.env.NODE_ENV === "production";
export const isProdDeployEnv =
  process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === "production";
export const baseUrl = isProdDeployEnv
  ? "https://dealbase.africa"
  : "https://dealbase-africa.vercel.app";

const dealbaseApiUrl = process.env.NEXT_PUBLIC_DEALBASE_API_URL;
const dealbaseApiVersion = process.env.NEXT_PUBLIC_DEALBASE_API_VERSION;

export const config = {
  dealbaseApiUrl: `${dealbaseApiUrl}/${dealbaseApiVersion}`,
  embedUrl: process.env.NEXT_PUBLIC_EMBED_URL,
  apiKey: process.env.NEXT_PUBLIC_DEALBASE_API_KEY,
  isProd,
  isProdDeployEnv,
  baseUrl,
};
