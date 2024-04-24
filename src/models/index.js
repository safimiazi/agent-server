// create modal here schema
// create modal for add and save data aobut the client 

const { default: mongoose } = require("mongoose");


const customerSchema = new mongoose.Schema({
    uniqueID:{
        type:String,
        required:true
    },
    customerName:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    condition:{
        type:String,
        required:true
    },
    pointRate:{
        type:Number,
        required:true
    }

})

// create modal 
const Customer = mongoose.model('CustomerList',customerSchema)



// export list 
module.exports = {Customer}