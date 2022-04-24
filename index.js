const express = require('express');
const app = express();
const cors = require('cors');
const {
    MongoClient,
    ServerApiVersion
} = require('mongodb');
const res = require('express/lib/response');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors);
app.use(express.json());

//Connect with mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rm3yw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});
async function run () {
    try{
        await client.connect();
        const productCollection = client.db('emajohn').collection('product');
        // console.log('DB is connected')
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
    }
    finally{
        // client.close();
    }
}

run().catch(console.dir);





//Root api
app.get('/', (req, res) => {
    res.send('Ema John server is running');
});

//Dynamic port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
