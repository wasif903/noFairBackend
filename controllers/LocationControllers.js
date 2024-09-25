import LocationModel from "../models/LocationModel.js";
import UserModel from "../models/UserModel.js";



const HandleCreateLocation = async (req, res) => {
    try {

        const { userID, latitude, longitude } = req.body

        const findUser = await UserModel.findById(userID);
        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const createLocation = LocationModel({
            userID,
            longitude,
            latitude
        })

        await createLocation.save();
        res.status(200).json({ message: "Location saved successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}


export {
    HandleCreateLocation
}