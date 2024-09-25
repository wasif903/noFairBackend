import ReelModel from "../models/ReelModel.js";
import UserModel from "../models/UserModel.js";
// import
import { v2 as cloudinary } from "cloudinary";



const HandlePostReels = async (req, res) => {
    try {

        const { userID } = req.params;
        const { text } = req.body;

        const findUser = await UserModel.findById(userID)
        if (!findUser) {
            return res.status(404).json({ message: "User not found" })
        }

        const reel = req.files.reel;
        const uploadResult = reel ? await cloudinary.uploader.upload(reel.tempFilePath, {
            resource_type: 'video',
            folder: `${findUser.username} products`,
        }) : '';

        const createReel = new ReelModel({
            userID: findUser._id,
            text: text,
            reel: uploadResult.secure_url,
        })
        await createReel.save();
        res.status(201).json({ message: 'Reel posted successfully' });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const HandleGetUserReels = async (req, res) => {
    try {
        const { userID } = req.params;
        const findUser = await UserModel.findById(userID)
        if (!findUser) {
            return res.status(404).json({ message: "User not found" })
        }
        const reels = await ReelModel.find({ userID: findUser._id }).populate({ path: 'userID', model: "user", select: 'username profile_image' }).populate({ path: 'likes', model: "user", select: 'username profile_image' })
        res.status(200).json(reels);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const HandleGetSingleReels = async (req, res) => {
    try {

        const { reelID } = req.params;
        const findReel = await ReelModel.findById(reelID).populate({ path: 'userID', model: "user", select: 'username profile_image' }).populate({ path: 'likes', model: "user", select: 'username profile_image' })
        if (!findReel) {
            return res.status(404).json({ message: "Reel not found" })
        }
        res.status(200).json(findReel);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const HandleGetAllReels = async (req, res) => {
    try {
        const { keyword } = req.query;
        if (!keyword || keyword === '') {
            const reels = await ReelModel.find().populate({ path: 'userID', model: "user", select: 'username profile_image' }).populate({ path: 'likes', model: "user", select: 'username profile_image' }).sort({ createdAt: -1 })
            return res.status(200).json(reels);
        } else {
            const reels = await ReelModel.find({
                text: { $regex: keyword, $options: 'i' }
            }).populate({ path: 'userID', model: "user", select: 'username profile_image' }).populate({ path: 'likes', model: "user", select: 'username profile_image' }).sort({ createdAt: -1 })
            res.status(200).json(reels);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const HandleUpdateReel = async (req, res) => {
    try {

        const { reelID, userID } = req.params;
        const { text } = req.body;

        const findUser = await UserModel.findById(userID);
        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const findReel = await ReelModel.findById(reelID);
        if (!findReel) {
            return res.status(404).json({ message: "Reel not found" });
        }
        if (findReel.userID.toString() !== findUser._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to update this reel" });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const HandleLikeReel = async (req, res) => {
    try {
        const { reelID, userID } = req.params;

        // Fetch the user and post objects
        const findPost = await ReelModel.findById(reelID);
        const findUser = await UserModel.findById(userID);

        if (!findUser) {
            return res.status(404).json({ message: "User Not Found" });
        }

        if (!findPost) {
            return res.status(404).json({ message: "Post Not Found" });
        }

        const userExists = findUser._id;

        const userIndex = findPost.likes.findIndex((like) =>
            like.includes(userExists)
        );

        if (userIndex !== -1) {
            findPost.likes.splice(userIndex, 1);
        } else {
            findPost.likes.push(userExists._id);
        }
        const saveRes = await findPost.save();
        res.status(200).json({ message: "Liked", likes: saveRes.likes });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export {
    HandlePostReels,
    HandleGetUserReels,
    HandleGetSingleReels,
    HandleGetAllReels,
    HandleUpdateReel,
    HandleLikeReel
}