const express = require('express');
const connectDB = require('./src/db/connectDB');
const router = require('./src/routes');
const globalErrorHandler = require('./src/utils/globalErrorHandler');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
require('dotenv').config();


// all router access here 

// Enable CORS for all origins
app.use(cors());

// Parse JSON bodies for POST requests
app.use(bodyParser.json());

app.use(router)






// connection database here 
app.get("/health",(req,res)=>{
    res.send('Coin selling server is running')
})


app.all('*',(req,res,next)=>{
    const error = new Error(`can't find ${req.originalUrl}on the server`)
    error.status = 404;
    next(error)
})

app.use(globalErrorHandler)


const main = async () =>{
    await connectDB()
    app.listen(port,()=>{
        console.log(`Coin selling server is running on port ${port}`);
    });
}

main()

module.exports = app; 