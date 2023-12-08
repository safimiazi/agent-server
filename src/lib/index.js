
const getDataUser = async()=>{
    try{
        return {message:'Hello i am comming to you very fastly'}
    }catch(error){
        console.log(error);
    }
}


module.exports = {getDataUser}