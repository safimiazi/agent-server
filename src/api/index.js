const { getDonorData } = require("../lib/users");
const DonursCollection = require("../models/Donors");

const exampleDataApi = async(req, res) =>{
    // you  can call the function form the lib for logic here
    console.log('reques accespt ',req.params.id);
    res.send({message : 'hello word server is running...'})
} 

const donourInfo = async(req,res)=>{

    const queryValue = req.query
   const result = await getDonorData(queryValue)
    
    console.log(result)
   res.send(result)

}

module.exports = {exampleDataApi,donourInfo}