const fs = require('fs');
const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 5000;
const app = express();

app.get('/', (req, res) => {
    // Serve index.html for all routes (SPA-style)
    const filePath = path.join(__dirname, 'public/index.html');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - index.html not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
})

app.get('/health', (req, res) => res.status(200).json({ status: 'server running' }));

app.listen(PORT, () => {
    console.log(`✅ Portfolio running at http://localhost:${PORT}`);
});
