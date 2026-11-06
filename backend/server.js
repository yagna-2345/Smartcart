require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {

    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(
        `SmartCart server running on port ${PORT}`
      );
    });

    const shutdown = async () => {
      console.log("Shutting down SmartCart...");

      server.close(async () => {
        await require("mongoose").connection.close();
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

  } catch (error) {
    console.error("Application startup failed:", error.message);
    process.exit(1);
  }
};

startServer();