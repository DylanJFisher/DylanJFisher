const fs = require('fs');
const https = require('https');

const url = 'https://api.github.com/users/DylanJFisher/repos';

// name of the repo you want to exclude (adjust if needed)
const EXCLUDED_REPO = 'DylanJFisher';

function readWriteAsync() {
    https.get(url, {
        headers: { 'User-Agent': 'node.js' }
    }, (res) => {

        let body = '';

        res.on('data', (data) => body += data);

        res.on('end', () => {
            try {
                body = JSON.parse(body);

                if (!Array.isArray(body)) {
                    console.error('GitHub API error:', body.message || body);
                    return process.exit(1);
                }

                const repos =
                    '\n' +
                    body
                        .filter(repo => !repo.fork && repo.name !== EXCLUDED_REPO)
                        .map(repo => `- [${repo.name}](${repo.html_url})`)
                        .join('\n') +
                    '\n';

                fs.readFile('README.md', 'utf8', (err, data) => {
                    if (err) throw err;

                    const updatedMd = data.replace(
                        /(## Latest Articles[\s\S]*?)(<!-- PROJECT-LIST:START -->[\s\S]*?<!-- PROJECT-LIST:END -->)/m,
                        `$1<!-- PROJECT-LIST:START -->\n${repos}<!-- PROJECT-LIST:END -->`
                    );

                    fs.writeFile('README.md', updatedMd, 'utf8', (err) => {
                        if (err) throw err;
                        console.log('README update complete.');
                    });
                });

            } catch (err) {
                console.error('Failed to process repositories:', err);
                process.exit(1);
            }
        });

    }).on('error', (err) => {
        console.error('HTTPS request failed:', err);
        process.exit(1);
    });
}

readWriteAsync();