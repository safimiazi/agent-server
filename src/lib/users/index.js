const { Customer } = require("../../models");

// save the data inside the dataebase 

const saveClientData = async (data) => {
    try {
        console.log('call the api');
        // Log client data (optional)
        if (!data || Object.keys(data).length === 0 ) return {message:'Something wrong: No data provided'}; // Check if data is provided

        // Check if the user already exists by uniqueId
        const existingUser = await Customer.findOne({ uniqueId: data.uniqueId });

        if (existingUser) {
            return {message:'User with the provided uniqueId already exists in the database'} // User already exists
        }

        // Check if the customer already exists by customerName
        const existingCustomer = await Customer.findOne({ customerName: data.customerName });

        if (existingCustomer) {
            return {message:'Customer with the provided customerName already exists in the database'}; // Customer already exists
        }

        // Create a new instance of Customer model with provided data
        const newClient = new Customer(data);

        // Save the client data to the database
        const savedClient = await newClient.save();

        // Return saved client data
        return {message:'successfully insert data ',savedClient};
    } catch (error) {
        // Handle error
        console.error('Error saving client data:', error);
        throw error; // Rethrow error for handling at the caller level
    }
};


//  geting all the register users 

const getingAllregiserUser = async ( ) =>{
    try{
        const getingAllUser = (await Customer.find())
        return getingAllUser;
    }catch(error){return error}
}


// get the clientUser data and search with pagination 

const getClientDataList = async(searchQuery, page = 1, pageSize = 50) =>{
    try{
        
        let query = {};

        // If searchQuery is provided, construct a regex pattern to match any part of the text
        if (searchQuery) {
            const regex = new RegExp(searchQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
            query = {
                $or: [
                    { customerName: { $regex: regex } },
                    { uniqueId: { $regex: regex } }
                    // Add more fields as needed
                ]
            };
        }


        // Calculate skip value for pagination
        const skip = (page) * pageSize;

        // Fetch client data from the database based on search criteria and pagination
        const clientListData = await Customer.find(query ).skip(skip).limit(pageSize) // with quiery data and pagination 
        const withOutQuery = await Customer.find().skip(skip).limit(pageSize) // without querydata list and pagination 
        const TotalDataLenght  = (await Customer.find()).length


        const finalliyValue = clientListData.length >  0 ? clientListData  :  withOutQuery ; 

        

        return { finalliyValue , TotalDataLenght };


    }catch(error){
        return error
    }
}



// edite data client list 

const editeClientData = async (clientId, newClientData) => {
    try {
        // Find the client by their ID and update their data
        const updatedClient = await Customer.findByIdAndUpdate(clientId, newClientData, { new: true });

        // Check if the client was found and updated
        if (!updatedClient) {
            throw new Error('Client not found');
        }

        // Return the updated client data
        return {message:'update data successfully ', updatedClient};
    } catch (error) {
        // Handle error
        console.error('Error updating client data:', error);
        throw error; // Rethrow error for handling at the caller level
    }
};


// deleted the database client 

const deleteClient = async (id) => {
    try {
        // Find the client by their unique ID
        if (!id) {
            return{message:'please provide Write data , somthing is wrong '}
        }
        const deletedClient = await Customer.deleteOne({_id: id})
        console.log(deletedClient);
        if (deletedClient.deletedCount === 0) {
            return {message:'client not found'}
        }
        return {message: 'client delete successfully'}

    } catch (error) {
        // Handle error
        console.error('Error deleting client:', error);
        throw error; // Rethrow error for handling at the caller level
    }
};



module.exports = { saveClientData ,getClientDataList,editeClientData,deleteClient,getingAllregiserUser};
