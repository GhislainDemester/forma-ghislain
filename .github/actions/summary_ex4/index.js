const core = require('@actions/core');
const glob = require('@actions/glob');
const path = require('path');
const fs = require('fs');

async function run() {
    try {
        const patterns = ['**/package.json', '!node_modules/**/package.json'];
        const globber = await glob.create(patterns.join('\n'));
        const files = await globber.glob();

        const analysedPackageJsonCount = files.length;
        let missingPackageLockJsonCount = 0;

        files.forEach(file => {
            const lockFile = path.join(path.dirname(file), 'package-lock.json');
            try {
                fs.accessSync(lockFile);
            } catch (err) {
                missingPackageLockJsonCount++;
                core.warning("Consider to generate it and commit it", {
                    title: "Missing package-lock.json",
                    file: file
                });
            }
        });


        await core.summary
            .addHeading('Package.json analysis')

            .addRaw(
                analysedPackageJsonCount === 0
                    ? 'No package.json found'
                    : (missingPackageLockJsonCount === 0
                        ? `No missing package-lock.json files based on ${analysedPackageJsonCount} package.json files analysed`
                        : `Missing ${missingPackageLockJsonCount} package-lock.json files based on ${analysedPackageJsonCount} package.json files analysed`)
            )
            .write();

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
