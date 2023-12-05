// dockerUtils.js
const Docker = require('dockerode');
const docker = new Docker();
const fs = require('fs');
const path = require('path');

async function createContainer(image, cmd, binds, workingDir, code, runtime) {
    const codePath = path.join(__dirname, '..', 'codefile', `userCode.${runtime.toLowerCase()}`);
    fs.writeFileSync(codePath, code);

    try {
        await docker.getImage(image).inspect();
    } catch (error) {
        console.log(`Pulling ${image} image from Docker Hub...`);
        await docker.pull(image);
    }

    try {
        const container = await docker.createContainer({
            Image: image,
            Cmd: cmd,
            HostConfig: {
                Binds: binds,
            },
            WorkingDir: workingDir,
        });

        return container;
    } catch (error) {
        console.error('Error creating Docker container:', error);
        throw error;
    }
}

// executionUtils.js
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

module.exports = {
    createContainer, execute
};

