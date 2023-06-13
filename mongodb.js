const mongoose = require('mongoose');

async function dbConnect(){
    return await mongoose.connect('mongodb+srv://yhjs1211:211211@cluster0.x2zlpmf.mongodb.net/?retryWrites=true&w=majority',{dbName:'NodeJs'}).then(()=>{console.log('connected!!')}).catch(console.log);
};

mongoose.connection.on('error',console.log);

module.exports=dbConnect;