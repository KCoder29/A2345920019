const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

const fetchurl = async (url) => {
    try {
        const response = await axios.get(url, { timeout: 500 });
        return response.data;
    } catch (error) {
        return { error: `Failed to fetch data from ${url}` };
    }
};

const filternumber = (numbers) => {
    return numbers.filter((number, index, self) => self.indexOf(number) === index);
};

app.get('/numbers', async (req, res) => {
    const urlList = req.query.url;

    if (!urlList) {
        return res.status(400).json({ error: 'Missing url parameter.' });
    }

    const urls = Array.isArray(urlList) ? urlList : [urlList];

    try {
        const responses = await Promise.all(
            urls.map(async (url) => fetchurl(url))
        );

        console.log('Responses = ', responses);

        const allnumbers = responses
            .filter(response => !response.error)
            .flatMap(response => response.numbers || [])

        console.log('All Numbers = ', allnumbers);

        const mergednumbers = filternumber(allnumbers).sort((a, b) => a - b);

        console.log('Merged Numbers = ', mergednumbers);

        res.json({ numbers: mergednumbers });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
