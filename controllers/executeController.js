const Docker = require('dockerode');
const fs = require('fs');
const path = require('path');

const docker = new Docker();

async function createContainer(code) {
    const codePath = path.join(__dirname, 'userCode.js');
    fs.writeFileSync(codePath, code);

    try {
        await docker.getImage('node:14').inspect();
    } catch (error) {
        console.log('Pulling Node.js 14 image from Docker Hub...');
        await docker.pull('node:14');
    }

    const workingDir = '/usr/src/app';

    try {
        const container = await docker.createContainer({
            Image: 'node:14',
            Cmd: ['node', `${workingDir}/userCode.js`],
            HostConfig: {
                Binds: [`${__dirname}:${workingDir}`],
            },
            WorkingDir: workingDir,
        });

        return container;
    } catch (error) {
        console.error('Error creating Docker container:', error);
        throw error;
    }
}
async function execute(container) {
    try {
        await container.start();
        const stream = await container.logs({ follow: true, stdout: true, stderr: true, encoding: 'utf-8' });
        return new Promise((resolve, reject) => {
            let data = '';

            stream.on('data', (chunk) => {
                data += chunk.toString('utf-8');
            });

            stream.on('end', () => {
                const cleanedData = data.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
                resolve(cleanedData);
            });

            stream.on('error', (error) => {
                reject(error);
            });
        });
    } catch (error) {
        console.error('Error executing code:', error);
        throw error;
    } finally {
        await container.stop();
        await container.remove();
    }
}


exports.executeCode = async (req, res) => {
    const code = req.body.code;
    try {
        const container = await createContainer(code);
        const result = await execute(container);
        res.json({ result: result });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}