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
            // add timeout
            const response = await axios.get(url, { timeout: 500 });

            if (response.status === 200) {
                // extract the data to push into the array
                const data = response.data;
                uniqueNumbers.push(...data.numbers);
            }
        }

        const mergedUniqueNumbers = uniqueNumbers
            .filter((number, index, self) => self.indexOf(number) === index);
        // sort the numbers
        const sortedNumbers = quickSort(mergedUniqueNumbers);

        res.json({ numbers: sortedNumbers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// quick sort with O(nlogn) functionality for sorting
function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const mid = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];

    for (const num of arr) {
        if (num < mid) {
            left.push(num);
        } else if (num > mid) {
            right.push(num);
        }
    }

    return [...quickSort(left), mid, ...quickSort(right)];
}

// port to listen
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
