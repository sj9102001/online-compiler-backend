const User = require('../models/User');
const File = require('../models/File');

exports.newFile = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new file
        const newFile = new File({
            filename: req.body.filename,
            runtime: req.body.runtime,
        });

        // Save the file
        const savedFile = await newFile.save();

        // Associate the file with the user
        user.files.push(savedFile._id);
        await user.save();

        res.status(201).json({
            message: 'File created successfully',
            file: savedFile,
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
        await user.populate('files', 'filename runtime content');

        // Extract the filename and fileruntime for each file
        const filesInfo = user.files.map(file => ({
            filename: file.filename,
            runtime: file.runtime,
            content: file.content
        }));

        res.status(200).json(filesInfo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}