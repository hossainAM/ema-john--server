const express = require('express');
const app = express();
const cors = require('cors');
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
const res = require('express/lib/response');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
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
    
        //api endpoint to load products page and size wise
        app.get('/product', async (req, res) => {
            // console.log('query', req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productCollection.find(query);
            let products;
            if(page || size) {
                products = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                products = await cursor.toArray();

            }
            res.send(products);
        });

        //api end point to to get product count
        app.get('/productcount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({count})//res.json can also be used if count as a variable is to sent, as count is not an json object;
        });

        //api endpoint by productkeys to load cart products
        app.post('/productbykeys', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id))
            const query = {_id: {$in: ids}};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
            // console.log(keys);
        })
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
