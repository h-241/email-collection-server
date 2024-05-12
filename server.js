const express = require("express");
const app = express();
var couchbase = require("couchbase");
const cors = require("cors");

require("dotenv").config();

async function main() {
  // User inputs
  const clusterConnStr = "couchbases://cb.htw8yzhbf5xlmny.cloud.couchbase.com"; // Replace this with Connection String
  const username = "BaseEnvironment"; // Replace this with username from database access credentials
  const password = process.env.COUCHBASE_PASSWORD; // Replace this with password from database access credentials
  const bucketName = "Environment";
  const scopeName = "User";
  const collectionName = "Human";

  const { v4: uuidv4 } = require("uuid");

  let sample_airline = {
    email: String,
    id: Number,
  };

  const key = uuidv4();

  // Get a reference to the cluster
  const cluster = await couchbase.connect(clusterConnStr, {
    username: username,
    password: password,
    // Use the pre-configured profile below to avoid latency issues with your connection.
    configProfile: "wanDevelopment",
  });

  app.use(cors);

  // Get a reference to the bucket
  const bucket = cluster.bucket(bucketName);
  // Get a reference to the collection
  const collection = bucket.scope(scopeName).collection(collectionName);
  // Simple K-V operation - to create a document with specific ID
  let createResult = await collection.insert(key, sample_airline);
  console.log("Create Document CAS: ", createResult.cas.toString());
  // Simple K-V operation - to retrieve a document by ID
  let getResult = await collection.get(key);
  console.log("Fetched document success. Result: ", getResult.content);
  // Simple K-V operation - to update a document by ID
  sample_airline.name = "Couchbase Airways!!";
  let updateResult = await collection.replace(key, sample_airline);
  console.log("Update document success. CAS: ", updateResult.cas.toString());
  // Simple K-V operation - to delete a document by ID
  let deleteResult = await collection.remove(key);
  console.log("Delete document success. CAS: ", deleteResult.cas.toString());
}
// Run the main function
main()
  .catch((err) => {
    console.log("Error: ", err);
    process.exit(1);
  })
  .then(process.exit);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}... 🚀`);
});
