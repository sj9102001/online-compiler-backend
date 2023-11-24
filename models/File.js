const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    runtime: {
        type: String,
        required: true,
        enum: ["PY", "JS", "CPP"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String,
    },

});

fileSchema.pre('save', function (next) {
    // Set default content only on the first save
    if (this.isNew) {
        switch (this.runtime) {
            case 'PY':
                this.content = 'print("Hello, World!")'; // Default Python code
                break;
            case 'JS':
                this.content = 'console.log("Hello, World!");'; // Default JavaScript code
                break;
            case 'CPP':
                this.content = '#include <iostream>\nint main() { std::cout << "Hello, World!" << std::endl; return 0; }'; // Default C++ code
                break;
            default:
                this.content = ''; // Default empty content
        }
    }
    next();
});

fileSchema.pre('updateOne', function (next) {
    // Update updatedAt on every update to content
    this.update({}, { $set: { updatedAt: new Date() } });
    next();
});
module.exports = mongoose.model('File', fileSchema);
