const File = require('../models/File');
const path = require('path');
const { createContainer, execute } = require('../utils/dockerUtils');

exports.executeCode = async (req, res) => {
    const fileId = req.body.fileId;

    try {
        const file = await File.findById(fileId);
        const code = file.content;
        const runtime = file.runtime;
        let container;
        let result;
        const pathToFile = path.join(__dirname, '..', 'codefile');
        switch (runtime) {
            case "JS":
                container = await createContainer('node:14', ['node', '/usr/src/app/userCode.js'], [`${pathToFile}:/usr/src/app`], '/usr/src/app', code, "JS");
                result = await execute(container);
                break;
            case "PY":
                container = await createContainer('python:3.9.18-alpine3.18', ['python', '/usr/src/app/userCode.py'], [`${pathToFile}:/usr/src/app`], '/usr/src/app', code, "PY");
                result = await execute(container);
                break;
            // case "CPP":
            //     container = await createContainerCPP();
            //     result = await executeCPP();
            //     break;
            default:
                result = "File Not Executable"
                break;
        }

        res.json({ result: result, fileId: fileId, runtime: runtime });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}