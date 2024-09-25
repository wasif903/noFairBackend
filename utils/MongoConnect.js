import mongoose from "mongoose";

const HandleConnectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("DB Connected Successfully");
  } catch (error) {

    console.log(error);
    console.log("Error While Connecting Database");
  }
};

export default HandleConnectDB;
