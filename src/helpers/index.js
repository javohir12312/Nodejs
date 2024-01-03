const fs = require('fs').promises;
const path = require('path');

async function deleteAllFilesFromUploadsFolder() {
  const uploadDir = path.join(__dirname, '../../', 'audio-uploads');

  try {
    const files = await fs.readdir(uploadDir);
    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      const fileStat = await fs.stat(filePath);
      if (fileStat.isFile()) {
        await fs.unlink(filePath);
      }
    }
  } catch (error) {
    console.error('Error deleting files:', error);
  }
}

const intervalDuration = 5 * 60 * 60 * 1000;

deleteAllFilesFromUploadsFolder();
setInterval(deleteAllFilesFromUploadsFolder, intervalDuration);
console.log(`Scheduled deletion every ${intervalDuration / (60 * 60 * 1000)} hours.`);

module.exports = deleteAllFilesFromUploadsFolder;
