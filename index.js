const express = require('express');
const list = require('./ports');
const app = express();

app.get('/', (req, res) => {
    res.send("Hello Word");
});

const maxNumber = Number.MAX_VALUE;
let num = 0;
let hashKey = 0;
let isAlive = new Set();

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

const serverHealth = async() =>{
    console.log("Started getting server Health data");
    for(let i in list.slaves){
        const response = await fetch(`http://localhost:${list.slaves[i]}/isActive`);
        if(response.status != 200){
            isAlive.delete(list.slaves[i]);
        }
        else{
            isAlive.add(list.slaves[i]);
        }
    }
    console.log(isAlive);
}

app.get('/getUrl', async (req, res) => {
    let hashValue = num % hashKey;
    res.status(200).json({ "url": `http://localhost:${list.slaves[hashValue]}`, "port" : list.slaves[hashValue]})
    num = (num + 1) % maxNumber;
})

const main = async () => {
    const NumberOfActiveServers = await getServerCount();
    console.log(NumberOfActiveServers);
    hashKey = NumberOfActiveServers;
    serverHealth();
    setInterval(serverHealth, 20000); 

    setInterval(async () => {
        try {
            let response = await fetch(`http://localhost:${list.master}/getUrl`);

            let data = await response.json();

            for(let i=0;i<list.slaves && !isAlive.contains(data.port);i++){
                response = await fetch(`http://localhost:${list.master}/getUrl`);
                data = await response.json();
            }

            console.log("Backend URL:", data.url);
        } catch (err) {
            console.error("Error fetching backend IP:", err.message);
        }
    }, 2000);
}

app.listen(8080, () => {
    console.log("Server started");
    main();
})