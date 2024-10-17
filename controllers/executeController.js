const File = require('../models/File');
const { createContainer, execute } = require('../utils/dockerUtils');

exports.executeCode = async (req, res) => {
    const fileId = req.body.fileId;

    try {
        const file = await File.findById(fileId);
        const code = file.content;
        const runtime = file.runtime;
        let container;
        let result;
        let cmd;
        // const pathToFile = path.join(__dirname, '..', 'codefile');
        switch (runtime) {
            case "JS":
                // cmd = ['node', '/usr/src/app/userCode.js']
                cmd = ['node', '-e', 'eval(process.env.CODE)']
                // container = await createContainer('node:14', cmd, [`${pathToFile}:/usr/src/app`], '/usr/src/app', code, "JS");
                container = await createContainer('node:14', cmd, code, "JS");
                result = await execute(container);
                break;
            case "PY":
                // cmd = ['python', '/usr/src/app/userCode.py']
                cmd = ['python', '-c', 'import os; exec(os.getenv("CODE"))']
                // container = await createContainer('python:3.9.18-alpine3.18', cmd, [`${pathToFile}:/usr/src/app`], '/usr/src/app', code, "PY");
                container = await createContainer('python:3.9.18-alpine3.18', cmd, code, "PY");
                result = await execute(container);
                break;
            case "DART":
                cmd = ['dart', 'run', '-c', 'import "dart:io"; void main() { print(Platform.environment["CODE"]); }'];
                // container = await createContainer("dart:latest", ["dart", "/usr/src/app/userCode.dart"], [`${pathToFile}:/usr/src/app`], '/usr/src/app', code, "DART");
                container = await createContainer("dart:latest", cmd, code, "DART");
                result = await execute(container);
                break;
            // case "CPP":
            //     container = await createContainer();
            //     result = await execute();
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


exports.basicPlanExecute = async (req, res) => {
    const code = req.body.code;
    const runtime = req.body.runtime;
    try {
        let container;
        let result;
        let cmd;
        // const pathToFile = path.join(__dirname, '..', 'codefile');
        switch (runtime) {
            case "JS":
                cmd = ['node', '-e', 'eval(process.env.CODE)']
                // container = await createContainer('node:14', ['node', '/usr/src/app/userCode.js'], [`${pathToFile}:/usr/src/app`], '/usr/src/app', code, "JS");
                container = await createContainer('node:14', cmd, code, "JS");
                result = await execute(container);
                break;
            case "PY":
                cmd = ['python', '-c', 'import os; exec(os.getenv("CODE"))']
                // container = await createContainer('python:3.9.18-alpine3.18', ['python', '/usr/src/app/userCode.py'], [`${pathToFile}:/usr/src/app`], '/usr/src/app', code, "PY");
                container = await createContainer('python:3.9.18-alpine3.18', cmd, code, "PY");
                result = await execute(container);
                break;
            case "DART":
                cmd = ['dart', 'run', '-c', 'import "dart:io"; void main() { print(Platform.environment["CODE"]); }'];
                // container = await createContainer("dart:latest", ["dart", "/usr/src/app/userCode.dart"], [`${pathToFile}:/usr/src/app`], '/usr/src/app', code, "DART");
                container = await createContainer("dart:latest", cmd, code, "DART");
                result = await execute(container);
                break;
            // case "CPP":
            //     container = await createContainer('gcc:latest', ['g++', '/usr/src/app/userCode.cpp', '-o', '/usr/src/app/userCode'], [`${pathToFile}:/usr/src/app`], '/usr/src/app', code, "CPP");
            //     result = await execute(container);
            //     break;
            default:
                result = "File Not Executable"
                break;
        }

        res.json({ result: result, runtime: runtime });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}