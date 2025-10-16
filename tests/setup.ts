import { execSync } from "node:child_process";

process.env.NODE_ENV = process.env.NODE_ENV ?? "test";

try {
  execSync("npx prisma db push --force-reset --skip-generate", {
    stdio: "pipe",
  });
} catch (error) {
  console.error("Failed to synchronize test database schema", error);
  throw error;
}
