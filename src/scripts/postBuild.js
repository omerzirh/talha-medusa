const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const MEDUSA_SERVER_PATH = path.join(process.cwd(), ".medusa", "server");

// Check if .medusa/server exists - if not, build process failed
if (!fs.existsSync(MEDUSA_SERVER_PATH)) {
  throw new Error(
    ".medusa/server directory not found. This indicates the Medusa build process failed. Please check for build errors.",
  );
}

// Copy package-lock.json OR create one if it doesn't exist
const packageLockPath = path.join(process.cwd(), "package-lock.json");
const destinationPackageLockPath = path.join(MEDUSA_SERVER_PATH, "package-lock.json");

if (fs.existsSync(packageLockPath)) {
  fs.copyFileSync(packageLockPath, destinationPackageLockPath);
} else {
    // Create a package-lock.json if it doesn't exist
    console.log("package-lock.json not found, creating a new one...");
    execSync("npm install", { cwd: MEDUSA_SERVER_PATH, stdio: "inherit" });
}



// Copy .env if it exists
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  fs.copyFileSync(envPath, path.join(MEDUSA_SERVER_PATH, ".env"));
}

// Install dependencies
console.log("Installing dependencies in .medusa/server...");
execSync("npm ci", {  // Use npm ci for faster, more reliable installs in a CI/CD environment
  cwd: MEDUSA_SERVER_PATH,
  stdio: "inherit",
});
