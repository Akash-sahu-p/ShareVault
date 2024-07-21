const mongoose=require('mongoose') //iske lie npm i mongoose karna hhh

const uri = 'mongodb+srv://akashsahu:akashsahu@node-tuts-cluster.rzcder3.mongodb.net/?retryWrites=true&w=majority&appName=node-tuts-cluster'
mongoose.connect(uri,{
    ///userNewUrlParser: true,
    //userCreateIndex: true
})
 
