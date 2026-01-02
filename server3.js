const express = require('express');

const app = express();
const PORT = 5003;

app.get('/',(re,res)=>{
    res.send("Server 3 started");
})

app.get('/isActive',async (req,res)=>{
    res.status(200).json({isActive:true});
})

app.listen(PORT,()=>{
    console.log(`Server running in the port ${PORT}`)
})
