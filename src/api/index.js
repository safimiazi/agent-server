
const { saveClientData , getClientDataList,editeClientData } = require("../lib/users");

// save clientDAta to database
const ClientListItemAdd = async(req, res) =>{
      try{
        const result = await saveClientData( {
            "UniqueID": "JD123",
            "CustomerName": "John Doe",
            "Type": "Regular",
            "Condition": "Active",
            "PointRate": 0.5
          },)

        res.status(200).send({massage:'successfully send data ',result})

      }catch(error){
        res.send(error)
      }
} 

// data get and search with pagination 

const getClientDataListAPI =async (req,res) => {
      try{
        const clientDataList  = await getClientDataList()
        res.status(200).send({massage:'successfully edite data', clientDataList})
      }catch(error){
        return error
      }
}

// eidte database client data 

const editeClientDataAPI = async(req,res) =>{
      try {
        // Extract client ID from request parameters
        const { clientId } = req.params;

        // Extract updated data from request body
        const newData = req.body;

        // Update client data in the database
        const updatedClient = await editeClientData(clientId, newData);

        // Return updated client data as response
        res.json(updatedClient);
    } catch (error) {
        // Handle errors
        console.error('Error updating client data:', error);
        res.status(500).json({ error: 'Failed to update client data' });
    }
}



// Define the route handler for deleting client data
const deleteClientData = async (req, res) => {
  try {
      // Extract client ID from request parameters
      const { clientId } = req.params;

      // Delete client data from the database
      await deleteClient(clientId);

      // Return success message as response
      res.json({ message: 'Client data deleted successfully' });
  } catch (error) {
      // Handle errors
      console.error('Error deleting client data:', error);
      res.status(500).json({ error: 'Failed to delete client data' });
  }
};



module.exports = {ClientListItemAdd,getClientDataListAPI,editeClientDataAPI , deleteClientData}