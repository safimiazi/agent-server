
const { saveClientData , getClientDataList,editeClientData,deleteClient , getingAllregiserUser } = require("../lib/users");

// save clientDAta to database
const ClientListItemAdd = async(req, res) =>{
      try{
        const clientInfo = req.body;
        
        const result = await saveClientData(clientInfo)
        res.status(200).send({result})

      }catch(error){
        res.send(error)
      }
} 

// get data from the database all the Register user 

const getAllRegiseterUser = async (req, res) =>{
      try{
        const finalResulst = await getingAllregiserUser()
        res.status(200).send({message:'successfully geing all users',finalResulst})
      }catch(error){return error}
}


// data get and search with pagination 

const getClientDataListAPI =async (req,res) => {
      try{
        const {pages,searchValue} = req.query;
        const clientDataList  = await getClientDataList(searchValue , pages)
        res.status(200).send({massage:'successfully geting data pagination search ', clientDataList})
      }catch(error){
        return error
      }
}

// eidte database client data 

const editeClientDataAPI = async(req,res) =>{
      try {
    
        // Extract client ID from request parameters
        const client  = req.params.id;

        // Extract updated data from request body
        const newData = req.body;

        // Update client data in the database
        const updatedClient = await editeClientData(client, newData);

        res.status(200).send(updatedClient)

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
      const clientId = req.params.id
   
      // Delete client data from the database
    const userDelted =  await deleteClient(clientId);

      // Return success message as response
      res.json({ message: 'Client data deleted successfully' , userDelted });
  } catch (error) {
      // Handle errors
      console.error('Error deleting client data:', error);
      res.status(500).json({ error: 'Failed to delete client data' });
  }
};

module.exports = {ClientListItemAdd,getClientDataListAPI,editeClientDataAPI , deleteClientData , getAllRegiseterUser}