import express from "express";
import { HandleGetAllReels, HandleGetSingleReels, HandleGetUserReels, HandleLikeReel, HandlePostReels, HandleUpdateReel } from "../controllers/ReelsController.js";


const router = express.Router();


router.post("/:userID/post-reels", HandlePostReels);

router.get("/:userID/get-user-reels", HandleGetUserReels);

router.get("/:reelID/single-reel", HandleGetSingleReels);

router.get("/get-all-reels", HandleGetAllReels);

router.patch("/:userID/update-reel", HandleUpdateReel)

router.patch("/:userID/like-reels/:reelID", HandleLikeReel)

export default router;