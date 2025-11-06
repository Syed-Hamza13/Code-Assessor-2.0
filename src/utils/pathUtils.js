// src/utils/pathUtils.js
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root directory (project root)
const rootDir = path.resolve(__dirname, "../../");

export default rootDir;
