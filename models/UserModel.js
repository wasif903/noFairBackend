import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    role: {
      type: [String],
      enum: ["User"],
      default: ["User"]
    },
    password: {
      type: String,
      required: true
    },
    profile_image: {
      type: String,
      default:
        "https://res.cloudinary.com/dhuhpslek/image/upload/fl_preserve_transparency/v1712595866/profile_demo_image_g57r6t.jpg?_s=public-apps"
    }
  },
  { timestamps: true }
);
export default mongoose.model("user", UserSchema);
