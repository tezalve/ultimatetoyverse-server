const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// tezalve
// GpSt8rpnhIP1r9eV


const uri = "mongodb+srv://tezalve:GpSt8rpnhIP1r9eV@cluster0.vvdmedc.mongodb.net/?retryWrites=true&w=majority";

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
        await client.connect();

        const toys = client.db('UltimateToyVerse').collection('Toys');

        app.get('/toys', async (req, res) => {
            const cursor = toys.find();
            const result = await cursor.toArray();
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