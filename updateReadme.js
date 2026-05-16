// Include node fs (file stream) and https modules
const fs = require('fs');
const https = require('https');

// API endpoint
const url = 'https://dev.to/api/articles?username=DylanJFisher';

function readWriteAsync() {
    // Get articles using HTTPS
    https.get(url, (res) => {
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

                // Get latest 3 articles
                body = body.slice(0, 3);

                // Create markdown list
                const articles =
                    '\n' +
                    body
                        .map(article => `- [${article.title}](${article.url})`)
                        .join('\n') +
                    '\n';

                // Read README
                fs.readFile('README.md', 'utf8', (err, data) => {
                    if (err) {
                        throw err;
                    }

                    // Replace section between markers
                    const updatedMd = data.replace(
                        /(<!-- BLOG-POST-LIST:START -->)([\s\S]*?)(<!-- BLOG-POST-LIST:END -->)/m,
                        `$1${articles}$3`
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
                console.error('Failed to process articles:', err);
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