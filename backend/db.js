
const mongoose=require('mongoose');
mongoose.set('strictQuery', false);
const mongoURI="mongodb://localhost:27017/preptech"
const connectToMongo= async()=>{
    mongoose.connect(mongoURI)
}
module.exports= connectToMongo;