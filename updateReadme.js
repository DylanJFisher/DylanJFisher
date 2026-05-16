// Include node fs (file stream) and https modules
const fs = require('fs');
const https = require('https');

// GitHub API endpoint (all repos for user)
const url = 'https://api.github.com/users/DylanJFisher/repos';

function readWriteAsync() {
    // Get repositories using HTTPS
    https.get(url, {
        headers: {
            'User-Agent': 'node.js'
        }
    }, (res) => {
        res.setEncoding('utf8');

        // Store response data
        let body = '';

        res.on('data', (data) => {
            body += data;
        });

        res.on('end', () => {
            try {
                // Parse JSON response
                body = JSON.parse(body);

                // Create markdown list of ALL repositories
                const repos =
                    '\n' +
                    body
                        .map(repo => `- [${repo.name}](${repo.html_url})`)
                        .join('\n') +
                    '\n';

                // Read README
                fs.readFile('README.md', 'utf8', (err, data) => {
                    if (err) {
                        throw err;
                    }

                    // Replace section between markers
                    const updatedMd = data.replace(
                        /(<!-- PROJECT-LIST:START -->)([\s\S]*?)(<!-- PROJECT-LIST:END -->)/m,
                        `$1${repos}$3`
                    );

                    // Write updated README
                    fs.writeFile('README.md', updatedMd, 'utf8', (err) => {
                        if (err) {
                            throw err;
                        }

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

// Run function
readWriteAsync();