const { ClientListItemAdd ,getClientDataListAPI,editeClientDataAPI} = require('../api')


const router = require('express').Router()




// save data to database 
router.post('/clientListItem',ClientListItemAdd)

// get data to database 
router.get('/getClientData',getClientDataListAPI)

// Define route to handle updating client data
router.put('/eiditeClientData/:clientId', updateClientData);

// deleted cliet data 
router.delete('/deleteClientData/:clientId', deleteClientData);


module.exports = router