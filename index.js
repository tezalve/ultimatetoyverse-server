const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// app.use(cors());
const corsConfig = {
    origin: '',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
app.use(express.json());

const uri = `mongodb+srv://tezalve:GpSt8rpnhIP1r9eV@cluster0.vvdmedc.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const toys = client.db('UltimateToyVerse').collection('Toys');

        app.get('/toys', async (req, res) => {
            const cursor = toys.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/toydetails/:id', async (req, res) => {
            const id = new ObjectId(req.params.id);
            const result = await toys.findOne({ _id: id});
            res.send(result);
        })

        app.get('/mytoys/:email', async (req, res) => {
            const email = atob(req.params.email);
            const cursor = toys.find({ seller_email: email});
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/addtoy', async(req, res)=>{
            const doc = req.body;
            const result = await toys.insertOne(doc);
            res.send(result);
        })

        app.put('/updatetoy', async(req, res)=>{
            const doc = req.body;
            const filter = {_id: new ObjectId(doc._id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  picture: doc.picture,
                  toy_name: doc.toy_name,
                  seller_name: doc.seller_name,
                  seller_email: doc.seller_email,
                  price: doc.price,
                  rating: doc.rating,
                  available_quantity: doc.available_quantity,
                  category: doc.category,
                  detail_description: doc.detail_description
                },
              };
            console.log('updated toy: ', updateDoc);
            const result = await toys.updateOne(filter, updateDoc, options);
            res.send(result);
            console.log(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
              );
        })

        app.delete('/deletetoy/:id', async (req, res) => {
            const _id = req.params.id;
            const filter = {_id: new ObjectId(_id)}
            const result = await toys.deleteOne(filter);
            res.send(result);
        })

        const categories = client.db('UltimateToyVerse').collection('categories');

        app.get('/categories', async (req, res) => {
            const cursor = categories.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.log);

app.get('/', (req, res) => {
    res.send('ultimatetoyverse-server is running');
})

app.listen(port, () => {
    console.log(`ultimatetoyverse-server is running on port: ${port}`);
})