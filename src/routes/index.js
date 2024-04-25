const { ClientListItemAdd ,getClientDataListAPI,editeClientDataAPI,deleteClientData, getAllRegiseterUser } = require('../api');
const { insertTransaction, getingTransationInfo, getingDataInfomationTatal } = require('../api/transation');

const router = require('express').Router()


// all the api call here with router mothod

// save data to database 
router.post('/clientListItem',ClientListItemAdd)

// geting all register users 
router.get('/getingRegisterUser', getAllRegiseterUser)

// get data to database with pagination ,search 
router.get('/getClientData',getClientDataListAPI)

// Define route to handle updating client data
router.put('/eiditeClientData/:id', editeClientDataAPI);

// deleted cliet data 
router.delete('/deleteClientData/:id', deleteClientData);

// insert transtion history 
router.post('/insertTransaction',insertTransaction)

// geting transation data to database 
router.get('/getTransationDAta',getingTransationInfo)

// geting total data to the database with searchFunctionlity  
router.get('/getingTotalData', getingDataInfomationTatal)




module.exports = router