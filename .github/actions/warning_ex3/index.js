const core = require('@actions/core');
const glob = require('@actions/glob');
const fs = require('fs');
const path = require('path');

async function run() {
    try {
        core.info('🔍 search package.json files');

        const globber = await glob.create('**/package.json', {
            ignore: ['**/node_modules/**']
        });

        const packageJsonPaths = await globber.glob();

        for (const packageJsonPath of packageJsonPaths) {
            const dir = path.dirname(packageJsonPath);
            const lockFilePath = path.join(dir, 'package-lock.json');

            if (!fs.existsSync(lockFilePath)) {
                core.warning('Consider to generate it and commit it', {
                    title: 'Missing package-lock.json',
                    file: packageJsonPath
                });
            }
        }

        core.info('✅ check finished');
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
