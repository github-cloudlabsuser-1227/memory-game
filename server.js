// server.js
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/get-symbols', async (req, res) => {
    const url = 'https://rawcdn.githack.com/akabab/starwars-api/0.2.1/api/all.json';
    
    try {
        const response = await axios.get(url);
        const symbols = response.data.slice(0, 8).map(character => ({
            name: character.name,
            image: character.image
        })); // Get first 8 characters with names and images
        res.json(symbols);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Failed to fetch symbols' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});