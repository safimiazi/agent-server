const exampleDataApi = async(req, res) =>{
    // you  can call the function form the lib for logic here
    console.log('reques accespt ',req.params.id);
    res.send({message : 'hello word server is running...'})
} 


module.exports = {exampleDataApi}