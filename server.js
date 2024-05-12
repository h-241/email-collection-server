const express = require("express");
const app = express();
const couchbase = require("couchbase");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

async function main() {
  // Couchbase connection details
  const clusterConnStr = "couchbases://cb.htw8yzhbf5xlmny.cloud.couchbase.com"; // Replace this with Connection String
  const username = "BaseEnvironment"; // Replace this with username from database access credentials
  const password = process.env.COUCHBASE_PASSWORD; // Replace this with password from database access credentials
  const bucketName = "Environment";
  const scopeName = "User";
  const collectionName = "Human";

  // Initialize Couchbase cluster connection
  const cluster = await couchbase.connect(clusterConnStr, {
    username: username,
    password: password,
    configProfile: "wanDevelopment",
  });

  // Initialize Couchbase bucket and collection
  const bucket = cluster.bucket(bucketName);
  const collection = bucket.scope(scopeName).collection(collectionName);

  // Define Express middleware
  app.use(express.json());
  app.use(cors());

  // Express route to handle POST requests
  app.post("/addEmail", async (req, res) => {
    try {
      const { email } = req.body; // Extract email from request body
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Generate a unique key for the document
      const key = uuidv4();

      // Document to be inserted into Couchbase
      const document = {
        email: email,
      };

      // Insert document into Couchbase
      await collection.insert(key, document);

      return res.status(201).json({ message: "Email added successfully" });
    } catch (error) {
      console.error("Error adding email:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}

// Run the main function
main()
  .then(() => {
    const PORT = process.env.PORT || 5050;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}... 🚀`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to Couchbase:", err);
    process.exit(1);
  });
