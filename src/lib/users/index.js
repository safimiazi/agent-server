const { Customer } = require("../../models");

// save clientUserData to data base 

const saveClientData = async (data) => {
    try {
        // Log client data (optional)
        console.log('Access the server link', data);
        
        // Create a new instance of Customer model with provided data
        const newClient = new Customer({
            uniqueID: data.UniqueID,
            customerName: data.CustomerName,
            type: data.Type,
            condition: data.Condition,
            pointRate: data.PointRate
        });

        // Save the client data to the database
        const savedClient = await newClient.save();

        // Return saved client data
        return savedClient;
    } catch (error) {
        // Handle error
        console.error('Error saving client data:', error);
        throw error; // Rethrow error for handling at the caller level
    }
};

// get the clientUser data and search with pagination 

const getClientDataList = async(searchQuery, page = 1, pageSize = 50) =>{
    try{
        
        // define query ovject for search criteria
        const query = searchQuery ? {$text: {$search: searchQuery}} : {};

        // calcuation skip vlue for pagination
        const skip = (page - 1 ) * 50 ;

        // Fetch client data from the database based on search criteria and pagincation 

        const clientListData = await Customer.find(query).skip(skip).limit(pageSize)
        
        return clientListData;

    }catch(error){
        return error
    }
}

// edite data client list 

const editeClientData = async(clientId,newClientData) =>{
    try{
        // find the client by thir id

        const client = await Customer.findById(clientId)

        // if the client don't exist trow the error 
        if ( !client){
            throw new Error('client no found')
        }

        // update the client data with the new data 

        Object.assign(client, newClientData)

        const updatedClient = await client.save();

        return updatedClient;

    }catch(error){
        return error
    }
}

// deleted the database client 

const deleteClient = async (uniqueId) => {
    try {
        // Find the client by their unique ID
        const client = await Customer.findOne({ uniqueID: uniqueId });

        // If the client doesn't exist, throw an error
        if (!client) {
            throw new Error('Client not found');
        }

        // Delete the client from the database
        await client.remove();
    } catch (error) {
        // Handle error
        console.error('Error deleting client:', error);
        throw error; // Rethrow error for handling at the caller level
    }
};






module.exports = { saveClientData ,getClientDataList,editeClientData};
