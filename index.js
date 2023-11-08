const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// MiddleWares
app.use(cors());
app.use(express.json());

// mukKlvs2R39WfAjU
// mobileStore

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://mobileStore:mukKlvs2R39WfAjU@cluster0.88ffpvi.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("mobileStoreDB");
    const brandCollection = database.collection("brands");
    const mobileCollection = database.collection("mobiles");
    const insertedCollection = database.collection("insertedMobile");

    // Get Brands Data
    app.get("/brands", async (req, res) => {
      try {
        const brands = await brandCollection.find().toArray();
        // console.log("brands", brands);
        res.send(brands);
      } catch (error) {
        console.log(error);
      }
    });

    // Get all Inserted Mobile data
    app.get("/mobiles", async (req, res) => {
      try {
        const mobiles = await insertedCollection.find().toArray();
        console.log(mobiles);
        res.send(mobiles);
      } catch (error) {
        console.log(error);
      }
    });

    // Get the data according to a single brand name
    app.get("/single-brand-mobile", async (req, res) => {
      try {
        const query = req.query;
        console.log("brandName", query);
        const mobiles = await insertedCollection.find(query).toArray();
        res.send(mobiles);
      } catch (error) {
        console.log(error);
      }
    });

    app.post("/mobiles", async (req, res) => {
      try {
        const addedProduct = req.body;
        console.log(addedProduct);
        const result = await insertedCollection.insertOne(addedProduct);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("MOBILE STORE SERVER IS RUNNING");
});

app.listen(port, (req, res) => {
  console.log(`MOBILE STORE SERVER IN RUNNING ON PORT ${port}`);
});
