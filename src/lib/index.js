const getDataformuser = async(name) =>{
    try{
        return{message:`Hi , How are your ${name}`}
    }catch(error){
        console.log(error);
    }
}

module.exports = {getDataformuser}