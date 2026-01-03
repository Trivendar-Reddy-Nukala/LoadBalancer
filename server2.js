const express = require('express');

const app = express();
const PORT = 5002;

app.get('/',(req,res)=>{
    res.send("Server 2 started");
})

let stop = false;

app.get('/isActive',async (req,res)=>{
    if(stop){
        res.status(500).json({isActive:false});
    }
    else{
        res.status(200).json({isActive:true});
    }  
})

app.listen(PORT,()=>{
    console.log(`Server running in the port ${PORT}`)
    setInterval(()=>{
        console.log(stop);
        stop = !stop;
    },15000)
})
