import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGODB_URL)
    return console.warn("nie znaleziono mongodb url");
  if (isConnected) return console.log("Juz połączono z bazą danych");

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("Połączono z MongoDB");
  } catch (error) {
    console.error(error);
  }
};
