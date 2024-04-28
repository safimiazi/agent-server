// create modal here schema
// create modal for add and save data aobut the client 

const { default: mongoose } = require("mongoose");


const customerSchema = new mongoose.Schema({
    uniqueId:{
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
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5356800 // 30 days in milliseconds
    }
});

// create modal 
const Customer = mongoose.model('CustomerList',customerSchema)



// export list 
module.exports = {Customer}