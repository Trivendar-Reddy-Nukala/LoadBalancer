const express = require('express');
const list = require('./ports');
const app = express();

app.get('/', (req, res) => {
    res.send("Hello Word");
});

const maxNumber = Number.MAX_VALUE;
let num = 0;
let hashKey = 0;

const getServerCount = async () => {
    let count = 0;
    for (let i in list.slaves) {
        const response = await fetch(`http://localhost:${list.slaves[i]}/isActive`);
        if (response.status == 200) {
            count = count + 1;
        }
    }
    return count;
}

app.get('/getBackendServerIp', async (req, res) => {
    let hashValue = num % hashKey;
    res.status(200).json({ "url": `http://localhost:${list.slaves[hashValue]}` })
    num = (num + 1) % maxNumber;
})

const main = async () => {
    const NumberOfActiveServers = await getServerCount();
    console.log(NumberOfActiveServers);
    hashKey = NumberOfActiveServers;

    setInterval(async () => {
        try {
            const response = await fetch(`http://localhost:${list.master}/getBackendServerIp`);

            const data = await response.json(); // 👈 IMPORTANT

            console.log("Backend URL:", data.url);
        } catch (err) {
            console.error("Error fetching backend IP:", err.message);
        }
    }, 1000);
}

app.listen(8080, () => {
    console.log("Server started");
    main();
})