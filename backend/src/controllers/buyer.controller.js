import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Property } from "../models/property.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { InterestedBuyer } from "../models/interestedBuyer.model.js";
import { User } from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";


const likeProperty = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const buyerId=req.user._id;
    const alreadylike = await InterestedBuyer.findOneAndDelete({ $and: [{ buyerId }, { propertyId }] });
    if(alreadylike) {
       return res.status(200).json(new ApiResponse(200, "", "unlike the property"))
    }
    await InterestedBuyer.create({buyerId,propertyId})
    return res.status(200).json(new ApiResponse(200, "", "like the property"));
});

const getPropertyById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const property = await Property.findById(id);
        if (!property) {
            throw new ApiError(404, "Property not found");
        }
        
        const user = await User.findById(property.userId).select("-password -refreshToken -_id -role -createdAt -updatedAt");
        
        sendEmail(req.user.email,user?.firstName+" "+user?.lastName,user.email,`${req.user?.firstName} interested in your property`,"Hi");
        sendEmail(user.email,user?.firstName+" "+user?.lastName,req.user.email,`${user?.firstName} Property details`,"Hi");

        if (!user) {
            throw new ApiError(404, "User not found for this property");
        }
        
        return res.status(200).json(new ApiResponse(200, { user }, "getProperty"));
    } catch (error) {
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
    }
});

const getPropertyforBuyer=asyncHandler(async(req,res)=>{
    const { page = 1, limit = 8, place, area, bedrooms, bathrooms, hospitalsNearby, collegesNearby } = req.query;
    const filters = {
        ...(place && { place }),
        ...(area && { area }),
        ...(bedrooms && { bedrooms }),
        ...(bathrooms && { bathrooms }),
        ...(hospitalsNearby && { hospitalsNearby }),
        ...(collegesNearby && { collegesNearby })
    };
    const pagPropery = await Property.getPropertyWithAttributes(page, limit, filters);
    return res.status(200).json(new ApiResponse(200, { pagPropery }, "getProperty"));
})

export {likeProperty,getPropertyById,getPropertyforBuyer}