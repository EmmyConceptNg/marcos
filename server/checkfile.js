import path from "path";
import fs from 'fs'
const recordsDir = path.join(process.cwd(), "public");
fs.readdir(recordsDir, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
  } else {
    console.log("Files in records directory:", files);
  }
});
