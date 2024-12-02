const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Set EJS as the template engine and serve static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/commits', async (req, res) => {
    try {
        // Fetch commits from the GitHub API
        const response = await axios.get('https://api.github.com/repos/nodejs/node/commits', {
            headers: { 'User-Agent': 'request' }
        });

        // Extract the latest 25 commits
        const commits = response.data.slice(0, 25).map(commit => ({
            author: commit.commit.author.name,
            message: commit.commit.message,
            hash: commit.sha,
        }));

        res.render('commits', { commits });
    } catch (error) {
        console.error('Error fetching commits:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/commits`));
