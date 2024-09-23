const mongoose = require("mongoose"); 
const dotenv = require("dotenv");
const app = require("./app"); 

// Handling uncaught exceptions
process.on('uncaughtException', err => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

// Load environment variables from the config file
dotenv.config({ path: './config.env' }); 

const db = process.env.DATABASE;

// Connect to the MongoDB database
mongoose.connect(db).then(() => {
    console.log('Connected to the database successfully');
}).catch(err => {
    console.error('Failed to connect to the database:', err.message);
});

// Define the port the server will listen on
const port = process.env.PORT || 3000; 



// Start the server
const server = app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
