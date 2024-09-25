import mongoose from "mongoose";
const { Schema } = mongoose;

const LocationModel = new Schema(
    {
        userID: {
            type: Schema.Types.ObjectId,
            ref: "user"
        },
        longitude: {
            type: String,
            require: true
        },
        latitude: {
            type: String,
            require: true
        },
    },
    { timestamps: true }
);

export default mongoose.model("locations", LocationModel);
