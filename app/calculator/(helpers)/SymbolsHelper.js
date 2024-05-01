import { promises as fs } from "fs";
export default async function readSymbols() {
  try {
    const file = await fs.readFile(
      process.cwd() + "/data/symbols.json",
      "utf8"
    );
    return JSON.parse(file);
  } catch (error) {
    console.error("Error reading symbols.json:", error);
    throw new Error("Failed to read symbols data");
  }
}
