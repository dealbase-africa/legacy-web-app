import { z } from "zod";

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z.object({
  CLOUDINARY_API_SECRET: z.string(),
  REBRANDLY_API_KEY: z.string(),
  SENTRY_AUTH_TOKEN: z.string(),
  SENTRY_DSN: z.string().url(),
  SENTRY_IGNORE_API_RESOLUTION_ERROR: z.string(),
  NODE_ENV: z.enum(["development", "preview", "test", "production"]),
});

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
  NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
  NEXT_PUBLIC_GOOGLE_ANALYTICS: z.string(),
  NEXT_PUBLIC_DEPLOYMENT_ENV: z.enum(["development", "test", "production"]),
  NEXT_PUBLIC_MAPBOX_TOKEN: z.string(),
  NEXT_PUBLIC_EMBED_URL: z.string(),
  NEXT_PUBLIC_DEALBASE_API_URL: z.string(),
  NEXT_PUBLIC_DEALBASE_API_VERSION: z.string(),
  NEXT_PUBLIC_DEALBASE_API_KEY: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 *
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  PUBLIC_CLOUDINARY_API_KEY: process.env.PUBLIC_CLOUDINARY_API_KEY,
  PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.PUBLIC_CLOUDINARY_CLOUD_NAME,
  REBRANDLY_API_KEY: process.env.REBRANDLY_API_KEY,
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
  SENTRY_DSN: process.env.SENTRY_DSN,
  SENTRY_IGNORE_API_RESOLUTION_ERROR:
    process.env.SENTRY_IGNORE_API_RESOLUTION_ERROR,
  NEW_RELIC_LICENSE_KEY: process.env.NEW_RELIC_LICENSE_KEY,
  NEW_RELIC_APP_NAME: process.env.NEW_RELIC_APP_NAME,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  NEXT_PUBLIC_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
  NEXT_PUBLIC_DEPLOYMENT_ENV: process.env.NEXT_PUBLIC_DEPLOYMENT_ENV,
  NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  NEXT_PUBLIC_EMBED_URL: process.env.NEXT_PUBLIC_EMBED_URL,
  NEXT_PUBLIC_DEALBASE_API_URL: process.env.NEXT_PUBLIC_DEALBASE_API_URL,
  NEXT_PUBLIC_DEALBASE_API_VERSION:
    process.env.NEXT_PUBLIC_DEALBASE_API_VERSION,
  NEXT_PUBLIC_DEALBASE_API_KEY: process.env.NEXT_PUBLIC_DEALBASE_API_KEY,
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === "undefined";

  const parsed = /** @type {MergedSafeParseReturn} */ (
    isServer
      ? merged.safeParse(processEnv) // on server we can validate all env vars
      : client.safeParse(processEnv) // on client we can only validate the ones that are exposed
  );

  if (parsed.success === false) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
  }

  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherwise it would just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith("NEXT_PUBLIC_")) {
        throw new Error(
          process.env.NODE_ENV === "production"
            ? "❌ Attempted to access a server-side environment variable on the client"
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`,
        );
      }
      return target[/** @type {keyof typeof target} */ (prop)];
    },
  });
}

export { env };
