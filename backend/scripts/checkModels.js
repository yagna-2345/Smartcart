require("dotenv").config();

const mongoose = require("mongoose");

const models = require("../models");

async function checkModels() {

  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("\nSMARTCART DATABASE MODEL TEST\n");

    Object.keys(models).forEach((modelName) => {

      console.log(`✓ ${modelName} model loaded`);

    });

    console.log("\nTotal models:", Object.keys(models).length);

    console.log("MongoDB connection successful");

  } catch (error) {

    console.error("Model test failed:", error.message);

    process.exitCode = 1;

  } finally {

    await mongoose.connection.close();

  }
}

checkModels();