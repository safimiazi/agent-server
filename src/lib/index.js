
const getDataUser = async(name)=>{
    try{
        return {message:`Hello i am comming to you very fastly ${name}`}
    }catch(error){
        console.log(error);
    }
}


module.exports = {getDataUser}