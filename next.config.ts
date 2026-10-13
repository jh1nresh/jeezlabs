import type { NextConfig } from "next";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

const publicRoot = join(root, "public");
const publicFiles = readdirSync(publicRoot, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => "/" + join(entry.parentPath, entry.name).slice(publicRoot.length + 1));

const nextConfig: NextConfig = {
  env: {
    JEEZLABS_PUBLIC_FILES: JSON.stringify(publicFiles),
  },
  turbopack: {
    root,
  },
};

export default nextConfig;
