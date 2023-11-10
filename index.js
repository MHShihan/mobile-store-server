const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// MiddleWares
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.88ffpvi.mongodb.net/?retryWrites=true&w=majority`;

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
    const insertedCollection = database.collection("insertedMobile");
    const addToCartCollection = database.collection("addToCart");

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

    // Get single Data
    app.get("/mobiles/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      if (req.params?.id?.length == 24) {
        const query = { _id: new ObjectId(id) };
        console.log(query);
        const result = await insertedCollection.findOne(query);
        res.send(result);
      } else {
        res.send({
          err: "input must be a 24 character hex string, 12 byte Uint8Array, or an integer",
        });
      }
    });

    // Get Data from AddToCart Collection
    app.get("/addToCarts", async (req, res) => {
      try {
        result = await addToCartCollection.find().toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    // Post Mobiles
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

    // Post cart data
    app.post("/addToCarts", async (req, res) => {
      try {
        const addToCart = req.body;
        const result = await addToCartCollection.insertOne(addToCart);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    // Put Updated Data
    app.put("/mobiles/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const query = { _id: new ObjectId(id) };
      const data = {
        $set: {
          ...updatedData,
        },
      };
      const result = await insertedCollection.updateOne(query, data);
      res.send(result);
    });

    // Delete From cart
    app.delete("/addToCarts/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const result = await addToCartCollection.deleteOne(query);
      console.log(result);
      res.send(result);
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
