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
    function verifyjwt(req,res,next){
        const authorization=req.headers.authorization;
        if(!authorization){
return res.status(400).send({error:true,message:"unauthorized user"})
        };
        const token=req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
            if(err){
                return res.status(401).send({error:true,message:"unauthorized user"})

            }
           req.decoded=decoded;
            next();
          });
    }
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
        // console.log(result);
    })
    app.delete("/admindelete/:id",async(req,res)=>{
        const id=req.params.id;
        console.log(id);
        const ids={ _id: new ObjectId(id) }
        const result = await collection3.deleteOne(ids);
        res.send(result);

    })
    app.put('/adminupdate/:id',async(req,res)=>{
        const id=req.params.id;
        const user=req.body;
        const filter = { _id:new ObjectId(id)};
        // const options = { upsert: true };


    const updateDoc = {

      $set: {

        ...user
    

      },

    };
    const result = await collection3.updateOne(filter, updateDoc);
    res.send(result);
    })
    app.post('/jwt',(req,res)=>{
    const user=req.body;
    const secret=process.env.SECRET_KEY;
    console.log(user);
    var token= jwt.sign(user,secret,{ expiresIn: '1h' });
    console.log(token);
    res.send({token});
    })
    app.get('/productsbyemail',verifyjwt,async(req,res)=>{
        const decod=req.decoded;
        console.log(req?.query?.email);
        let query={};
        if(req?.query?.email){
          query={email:req?.query?.email}
        }
        const result=await collection2.find(query).toArray();
        res.send(result);
    })
    app.get('/admindata',async(req,res)=>{
        const cursor =await collection3.find().toArray();
        console.log(cursor);
        res.send(cursor);
    })
    app.get('/admindata/:id',async(req,res)=>{
        const id=req.params.id;
        const query = { _id:new ObjectId(id) };
        const movie = await collection3.findOne(query);
        res.send(movie);  
    })
  
    app.get('/products',async(req,res)=>{
        const cursor =await collection.find().toArray();
        console.log(cursor);
        res.send(cursor);
    })
    // app.get('/products2',async(req,res)=>{
    //     const cursor =await collection2.find().toArray();
    //     console.log(cursor);
    //     res.send(cursor);
    // })
    // app.get('/products/:id',async(req,res)=>{
    //     const id=req.params.id;
    //     const query = { _id:new ObjectId(id) };
    //     const movie = await collection.findOne(query);
    //     res.send(movie);
    // })
    
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