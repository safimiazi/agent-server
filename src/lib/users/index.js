const DonursCollection = require("../../models/Donors")

const getDonorData = async(queryData)=>{
    try{
        
       console.log(queryData)
       const query = {}
       queryData.blood_group == 'all' || (query.blood_group = queryData.blood_group)
       queryData.age == 'all' || (query.age = queryData.age)
       queryData.gender == 'all' || (query.gender = queryData.gender)
       queryData.zila == 'all' || (query.zila = queryData.zila)
       console.log(query)
        const result = await DonursCollection.find(query)
    
        return result
    }
    catch(error){
       return error
    }
}

module.exports = {getDonorData}