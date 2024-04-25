


// insert data to the database 

const { transactioListItem } = require("../../models/transaction");

const transactionInfo = async(transation) =>{
    try{
        console.log(transation);
        const insertTransation = new transactioListItem(transation)

        console.log(insertTransation,'insert data modal list');

        

        const finallyInsert = await insertTransation.save()  // save data to mongoose with mongodb

        console.log(finallyInsert, 'data insert ');

        return finallyInsert ; 

    }catch(error){
        return error
    }
}


// geting a transation information 

const getingTransactionInfo = async(searchQuery, page = 1, pageSize = 50) =>{
    try{
        let query = {};

        // If searchQuery is provided, construct a regex pattern to match any part of the text
        if (searchQuery) {
            const regex = new RegExp(searchQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
            query = {
                $or: [
                    { orderId: { $regex: regex } },
                    { customerId: { $regex: regex } }
                    // Add more fields as needed
                ]
            };
        }
        
        // Calculate skip value for pagination
        const skip = (page) * pageSize;

        // Fetch client data from the database based on search criteria and pagination
        const clientListData = await transactioListItem.find(query ).skip(skip).limit(pageSize) // with quiery data and pagination 
        const withOutQuery = await transactioListItem.find().skip(skip).limit(pageSize) // without querydata list and pagination 
        const TotalDataLenght  = ( await transactioListItem.find()).length

        console.log(clientListData , withOutQuery , TotalDataLenght);

        const finalliyValue = clientListData.length >  0 ? clientListData  :  withOutQuery ; 

        

        return { finalliyValue , TotalDataLenght };


    }catch(error){
        return error
    }
}
const getingTransationTotal = async (days , searchQuery = 'Customer2') => {
    try {

        console.log(days.search);

        let startDate, endDate;
        const currentDate = new Date();
        const timeRange = days.search;

        switch (timeRange) {
            case 'today':
                startDate = new Date(currentDate);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(currentDate);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'fastWeek':
                startDate = new Date(currentDate);
                startDate.setDate(startDate.getDate() - 7);
                endDate = new Date(currentDate);
                break;
            case 'last-week':
                startDate = new Date(currentDate);
                startDate.setDate(startDate.getDate() - currentDate.getDay() - 6);
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                break;
            case 'last-month':
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'this-month':
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                endDate.setHours(23, 59, 59, 999);
                break;
            default:
                throw new Error('Invalid timeRange');
        }

        console.log(startDate, endDate);


        // Fetch data based on searchQuery and time range
        const NameSearchValue = await transactioListItem.find({ customerId: searchQuery});
        const searchByTimes = await transactioListItem.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        })


        // searchUserData Calculation by name 

         const totalAmout = NameSearchValue[0].amount ;
         const totalCredite = NameSearchValue[0].points;
         const totalAgents = 1 ;
        // payment system  
         

        

      

        console.log(NameSearchValue , searchByTimes);


    } catch (error) {
        // Handle any errors
        console.error("Error while fetching transaction data:", error);
        throw error;
    }
}


// return and export the value 

module.exports = { transactionInfo , getingTransactionInfo , getingTransationTotal} 