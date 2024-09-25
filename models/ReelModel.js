import mongoose from "mongoose";
const { Schema } = mongoose;

const ReelModel = new Schema(
    {
        userID: {
            type: Schema.Types.ObjectId,
            ref: "user"
        },
        reel: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        likes: {
            type: [String]
        },
    },
    { timestamps: true }
);

export default mongoose.model("reels", ReelModel);