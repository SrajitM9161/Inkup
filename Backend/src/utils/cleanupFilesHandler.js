import fs from "fs/promises";

export const cleanupFiles = async (files) => {
  for (const file of files) {
    try {
      if (file) {
        await fs.unlink(file);
        console.log(`🧹 Deleted: ${file}`);
      }
    } catch (err) {
      if (err.code !== "ENOENT") {
        console.error(`⚠️ Failed to delete ${file}:`, err.message);
      }
    }
  }
};
