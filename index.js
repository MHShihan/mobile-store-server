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

    app.get("/brands", async (req, res) => {
      try {
        const brands = await brandCollection.find().toArray();
        console.log("brands", brands);
        res.send(brands);
      } catch (error) {
        console.log(error);
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
