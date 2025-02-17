module.exports = {
    branches: ['main', 'master'],
    plugins: [
        '@semantic-release/commit-analyzer',
        ['semantic-release-lerna', { generateNotes: true }],
        '@semantic-release/changelog',
        [
            '@semantic-release/git',
            {
                assets: [
                    'CHANGELOG.md',
                    'lerna.json',
                    'package.json',
                    'package-lock.json',
                    'packages/*/package.json',
                ],
            },
        ],
    ],
};
