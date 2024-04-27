const { transactionInfo, getingTransactionInfo, getingTransationTotal } = require("../lib/users/transaction")

// insert transtiaon infomation 
const insertTransaction = async ( req, res) =>{
    try{
        const transationInfo = req.body
        const reusltInsert = await transactionInfo(transationInfo)
        res.status(200).send({reusltInsert})
    }catch(error){
        return error
    }
}

// geting transtaion data 
const getingTransationInfo = async(req, res) =>{
    try{
        const {search , pageNumber} = req.query;
        const getingTransationResult = await getingTransactionInfo(search,pageNumber)
        res.status(200).send({getingTransationResult})
    }catch(error){return error}
}

// geting transaction total information with all the data calculation and searchFunctionlity 
const getingDataInfomationTatal = async(req, res)=>{
    try{
        const queryValue = req.query;
        const getingFinalResult = await getingTransationTotal(queryValue)  // call the function for geting data to database 
        res.status(200).send(getingFinalResult)

    }catch(error){
        return error
    }
}


module.exports = {insertTransaction , getingTransationInfo , getingDataInfomationTatal}