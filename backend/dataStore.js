const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(fileName) {
  return path.join(DATA_DIR, fileName);
}

function readJson(fileName) {
  const filePath = getFilePath(fileName);

  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]", "utf8");
      return [];
    }

    const raw = fs.readFileSync(filePath, "utf8");
    if (!raw.trim()) {
      return [];
    }

    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

function writeJson(fileName, data) {
  const filePath = getFilePath(fileName);

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

module.exports = {
  readJson,
  writeJson,
};

