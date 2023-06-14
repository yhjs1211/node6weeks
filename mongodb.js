const mongoose = require('mongoose');

async function dbConnect(){
    await mongoose.connect('mongodb+srv://yhjs1211:211211@cluster0.x2zlpmf.mongodb.net/?retryWrites=true&w=majority',{dbName:'NodeJs'}).then(()=>{console.log('mongoDB connected!!')}).catch(console.log);
};

mongoose.connection.on('error',console.log);

module.exports=dbConnect;