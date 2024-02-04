// DeleteFileHandler.js
const { FileModel } = require('../Schema/Schema');

const removeFile = async (req, res) => {
  const filename = req.params.filename;
  try {
    const result = await FileModel.deleteOne({ fileName: filename });

    if (result.deletedCount === 1) {
      // The file was successfully deleted
      res.status(200).json({ success: true, message: 'File removed successfully' });
    } else if (result.deletedCount === 0) {
      // No matching file found for deletion
      res.status(404).json({ success: false, message: 'File not found' });
    } else {
      // If deletedCount is greater than 1, it's an unexpected scenario
      res.status(500).json({ success: false, message: 'Unexpected server error' });
    }
  } catch (error) {
    console.error('Error removing file from the database', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { removeFile };
