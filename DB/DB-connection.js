// import mongoose from "mongoose";

// const db_connection = async () => {
//   await mongoose
//     .connect(process.env.atlas_URL)
//     .then(() => {
//       console.log("MongoDB connected successfully");
//     })
//     .catch((error) => {
//       console.error("MongoDB connection error:", error);
//     });
// };

// export default db_connection;

import mongoose from "mongoose";

let isConnected = false;

const db_connection = async () => {
  if (isConnected) return;

  const uri = process.env.atlas_URL;
  if (!uri) {
    throw new Error("MongoDB connection string is missing in environment variables.");
  }

  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default db_connection;
