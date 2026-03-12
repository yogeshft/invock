import { app } from "./app";
import { config } from "./config";
import { connectToDatabase } from "./db/connect";

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(config.port, () => {
      console.log(`Inventory API running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server.", error);
    process.exit(1);
  }
};

 startServer();
