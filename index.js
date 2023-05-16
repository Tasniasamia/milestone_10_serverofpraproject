const express = require('express')
const app = express()
var jwt = require('jsonwebtoken');
const port = process.env.PORT || 8990;
var cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ioy1chb.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db("NewItem");

    const collection = database.collection("itemcollection");
    const collection2=database.collection("itemcollection2");
    const collection3=database.collection("itemcollection3")

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    app.post('/aditems',async(req,res)=>{
        const products=req.body;
        console.log(products);
        const result = await collection.insertOne(products);
        res.send(result);
        console.log(result);
    })
    app.post('/getferdata',async(req,res)=>{
        const products=req.body;
        console.log(products);
        const result = await collection2.insertOne(products);
        res.send(result);
        console.log(result);
    })
    app.post('/admin',async(req,res)=>{
        const admins=req.body;
        console.log(admins);
        const result = await collection3.insertOne(admins);
        res.send(result);
        console.log(result);
    })
    // app.get('/admindata',async(req,res)=>{
    //     const cursor =await collection3.find().toArray();
    //     console.log(cursor);
    //     res.send(cursor);
    // })
    app.get('/products',async(req,res)=>{
        const cursor =await collection.find().toArray();
        console.log(cursor);
        res.send(cursor);
    })
    app.get('/products2',async(req,res)=>{
        const cursor =await collection2.find().toArray();
        console.log(cursor);
        res.send(cursor);
    })
    app.get('/products/:id',async(req,res)=>{
        const id=req.params.id;
        const query = { _id:new ObjectId(id) };
        const movie = await collection.findOne(query);
        res.send(movie);
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })