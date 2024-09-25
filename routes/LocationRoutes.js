import express from "express";
import { HandleCreateLocation } from "../controllers/LocationControllers.js";


const router = express.Router();


router.post("/:userID/create-location", HandleCreateLocation);


export default router;