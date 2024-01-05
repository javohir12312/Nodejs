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
    console.log('All files deleted from audio-uploads folder.');
  } catch (error) {
    console.error('Error deleting files:', error);
  }
}

// Set the interval duration to run every 1 hour (3600 seconds).
const intervalDuration = 3600;

// Run the function once immediately when the script starts.
deleteAllFilesFromUploadsFolder();

// Set the interval to run the function every hour.
setInterval(deleteAllFilesFromUploadsFolder, intervalDuration * 1000);

console.log(`Scheduled deletion every ${intervalDuration / 3600} hour(s).`);

module.exports = deleteAllFilesFromUploadsFolder;
