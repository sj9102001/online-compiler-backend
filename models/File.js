const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    runtime: {
        type: String,
        required: true,
        enum: ["PY", "JS", "CPP", "DART", "file"]
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
                this.content = 'print("Hello, World!")';
                break;
            case 'JS':
                this.content = 'console.log("Hello, World!");';
                break;
            case 'CPP':
                this.content = '#include <iostream>\nint main() {\n std::cout << "Hello, World!" << std::endl;\n return 0; }';
                break;
            case 'DART':
                this.content = 'void main() {\n print("Hello World"); \n}';
                break;
            default:
                this.content = '';
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
