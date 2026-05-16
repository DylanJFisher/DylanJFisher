// Include node fs (file stream) and https modules
const fs = require('fs');
const https = require('https');

// API endpoint
const url = 'https://dev.to/api/articles?username=DylanJFisher';

function readWriteAsync() {
    // Get articles using HTTPS
    https.get(url, (res) => {
        res.setEncoding('utf8');

        // Set variable body to response data from API
        let body = '';

        res.on('data', (data) => {
            body += data;
        });

        res.on('end', () => {
            try {
                // Parse the JSON response
                body = JSON.parse(body);

                // Shorten array to latest 3 articles
                body = body.slice(0, 3);

                // Create markdown list dynamically
                const articles =
                    '\n' +
                    body
                        .map(article => `- [${article.title}](${article.url})`)
                        .join('\n') +
                    '\n\n';

                // Update README using FS
                fs.readFile('README.md', 'utf-8', (err, data) => {
                    if (err) {
                        throw err;
                    }

                    // Replace content between markers
                    const updatedMd = data.replace(
                        /(?<=What I'm writing:\n\n)[\s\S]*?(?=\n!\[Build README\])/m,
                        articles
                    );

                    // Write the new README
                    fs.writeFile('README.md', updatedMd, 'utf-8', (err) => {
                        if (err) {
                            throw err;
                        }

                        console.log('README update complete.');
                    });
                });
            } catch (err) {
                console.error('Failed to process articles:', err);
            }
        });
    }).on('error', (err) => {
        console.error('HTTPS request failed:', err);
    });
}

// Call the function
readWriteAsync();