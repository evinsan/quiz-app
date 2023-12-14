const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const rankingsFilePath = path.join(__dirname, 'rankings.json');

app.use(express.json());
app.use(express.static('public'));
app.use(cors()); // Enable CORS for all routes

app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexPath);
});

app.get('/api/rankings', (req, res) => {
    // Read rankings from file and send as JSON
    const rankings = readRankings();
    res.json(rankings);
});

app.post('/api/rankings', (req, res) => {
    // Add a new result to rankings and save to file
    const result = req.body;
    addResult(result);
    res.json({ message: 'Result added successfully.' });
});

function readRankings() {
    try {
        const data = fs.readFileSync(rankingsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading rankings:', error.message);
        return [];
    }
}

function addResult(result) {
    const rankings = readRankings();
    rankings.push(result);

    try {
        fs.writeFileSync(rankingsFilePath, JSON.stringify(rankings, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing rankings:', error.message);
    }
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
