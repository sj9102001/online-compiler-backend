const User = require('../models/User');
const File = require('../models/File');

exports.newFile = async (req, res) => {
    try {
        const userId = req.body.userId;
        // Check if the user exists
        console.log(req.body);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Unauthorized Access' });
        }

        // Create a new file
        const newFile = new File({
            filename: req.body.filename,
            runtime: req.body.runtime,
        });
        console.log(newFile.filename);
        // Save the file
        const savedFile = await newFile.save();

        // Associate the file with the user
        user.files.push(savedFile._id);
        await user.save();

        res.status(201).json({
            message: 'File created successfully',
            file: savedFile,
            fileId: savedFile._id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.getFiles = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Populate the files array to get the filename and fileruntime for each file
        await user.populate('files', 'filename runtime');

        // Extract the filename and fileruntime for each file
        const filesInfo = user.files.map(file => ({
            filename: file.filename,
            runtime: file.runtime,
            fileId: file._id
        }));

        res.status(200).json({ totalFiles: filesInfo.length, files: filesInfo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.getCode = async (req, res) => {
    try {
        const codeId = req.params.codeId;
        const fileContent = await File.findById(codeId);
        res.status(200).json({
            filename: fileContent.filename,
            runtime: fileContent.runtime,
            content: fileContent.content,
            id: fileContent.id
        })
    } catch {
        res.status(500).json({ message: "Internal Server Error" });
    }
}


exports.saveCode = async (req, res) => {
    try {
        const codeId = req.params.codeId;
        const newContent = req.body.content;

        const updatedFile = await File.findByIdAndUpdate(
            codeId,
            { content: newContent },
            { new: true }
        );

        if (!updatedFile) {
            return res.status(404).json({ message: "File not found" });
        }

        res.status(200).json({
            content: updatedFile.content,
            id: updatedFile.id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.deleteFile = async (req, res) => {
    try {
        const codeId = req.params.codeId;
        const userId = req.body.userId;
        console.log(req.body);
        // Check if the user exists
        console.log(userId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Unauthorized access' });
        }

        const fileToDelete = await File.findById(codeId);

        if (!fileToDelete) {
            return res.status(404).json({ message: 'File not found' });
        }

        await User.findByIdAndUpdate(userId, { $pull: { files: codeId } });

        await File.findByIdAndDelete(codeId);

        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};