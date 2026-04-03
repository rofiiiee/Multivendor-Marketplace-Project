const mongoose = require("mongoose");

/**
 * Establish connection to MongoDB Atlas or Local Instance
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Logging host for easier debugging in development
    console.log(`MongoDB Connected: ${conn.connection.host} `);
  } catch (error) {
    console.error("Critical Error: Database connection failed ");
    console.error(`Error Details: ${error.message}`);
    
    // Exit process with failure (1) if database is not reachable
    process.exit(1);
  }
};

// Handle connection errors after initial connection
mongoose.connection.on("error", (err) => {
  console.error(`MongoDB Post-Connection Error: ${err}`);
});

module.exports = connectDB;