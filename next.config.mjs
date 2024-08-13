/* eslint-disable @typescript-eslint/no-var-requires */
// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds and Linting.
 */
// !process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

import { withSentryConfig } from "@sentry/nextjs";
import { withAxiom } from "next-axiom";
import nextPWA from "next-pwa";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV === "development";
const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: dev,
  mode: process.env.NODE_ENV,
});

/**
 * @type {import('next').NextConfig}
 */
const moduleExports = {
  reactStrictMode: true,
  transpilePackages: [
    "@dealbase/db",
    "@dealbase/core",
    "@dealbase/client",
    "@dealbase/fixtures",
  ],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: !!process.env.CI },
  // typescript: { ignoreBuildErrors: !!process.env.CI },
  images: {
    domains: ["picsum.photos", "res.cloudinary.com"],
  },
  swcMinify: true,
  experimental: {
    esmExternals: true,
    outputFileTracingRoot: path.join(__dirname, "../../"),
    outputFileTracingExcludes: {
      "*": [
        "node_modules/.pnpm/@swc+core-linux-x64-musl@*",
        "node_modules/.pnpm/@swc+core-linux-x64-gnu@*",
        "node_modules/.pnpm/@esbuild+linux-x64@*",
      ],
    },
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: "dealbaseafrica",
  project: "web-app",
  include: ".",
  ignore: ["node_modules", "next.config.js"],
  hideSourceMaps: true,
  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
export default process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === "production"
  ? withAxiom(
      withPWA(withSentryConfig(moduleExports, sentryWebpackPluginOptions)),
    )
  : withPWA(moduleExports);
