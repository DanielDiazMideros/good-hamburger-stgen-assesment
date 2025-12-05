const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProd && repo ? `/${repo}` : "",
  assetPrefix: isProd && repo ? `/${repo}/` : "",
};

module.exports = nextConfig;
