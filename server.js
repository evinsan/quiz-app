const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// File Paths
const indexPath = path.join(__dirname, 'public', 'index.html');
const rankingsFilePath = process.env.RANKINGS_FILE_PATH || path.join(__dirname, 'rankings.json');

// Routes
app.get('/', (req, res) => {
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

// Functions
function readRankings() {
    try {
        console.log('Reading rankings from file...');
        const data = fs.readFileSync(rankingsFilePath, 'utf8');
        console.log('Rankings read successfully:', data);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading rankings:', error.message);
        return [];
    }
}

function addResult(result) {
    const rankings = readRankings();
    rankings.push(result);

    console.log('Adding result:', result);
    
    fs.writeFileSync(rankingsFilePath, JSON.stringify(rankings, null, 2), 'utf8');
    console.log('Result added successfully.');
}

// Server Start
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
