const express = require('express');
const axios = require('axios');

// initializing express app and port
const app = express();
const port = process.env.PORT || 8008;

app.get('/numbers', async (req, res) => {
    // taking urls from query and initializing and array called uniqueNumbers to store the res numbers
    const urls = req.query.url || [];
    const uniqueNumbers = [];

    try {
        for (const url of urls) {
            const response = await axios.get(url);

            if (response.status === 200) {
                const data = response.data;
                uniqueNumbers.push(...data.numbers);
            }
        }

        const mergedUniqueNumbers = uniqueNumbers
            .filter((number, index, self) => self.indexOf(number) === index);

        res.json({ numbers: mergedUniqueNumbers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
