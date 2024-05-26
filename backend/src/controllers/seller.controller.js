import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Property } from "../models/property.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const getPropertiesForSeller = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const properties = await Property.aggregate([
        { $match: { userId } },
        {
            $lookup: {
                from: "propertyattributes", // This should match the collection name of PropertyAttribute
                localField: "_id",
                foreignField: "propertyId",
                as: "attribute"
            }
        },
        { $unwind: "$attribute" }
    ]);
    return res
        .status(200)
        .json(new ApiResponse(200, properties, "getProperty"));
});

const addProperty = asyncHandler(async (req, res) => {
    const { title, description, place, area, price, bedrooms, bathrooms, nearbyHospitals, nearbyColleges } = req.body;

    if ([title, description, place, area, price, bedrooms, bathrooms].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const propertyData = { title, description, place, area, price };
    const attributesData = { bedrooms, bathrooms, nearbyHospitals, nearbyColleges };

    const { savedProperty, savedAttributes } = await Property.prototype.createPropertyWithAttributes(req.user._id, propertyData, attributesData);

    return res.status(201).json(new ApiResponse(200, { savedProperty, savedAttributes }, "addProperty"));
});

const updateProperty = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const propertydatafromDataBase = await Property.findById(id);
    if (!req.user._id.equals(propertydatafromDataBase.userId)) {
        throw new ApiError(400, "You don't have access to modify this property");
    }
    const { title, description, place, area, price, bedrooms, bathrooms, nearbyHospitals, nearbyColleges } = req.body;

    if ([title, description, place, area, price, bedrooms, bathrooms].some(field => !field === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const propertyData = { title, description, place, area, price };
    const attributesData = { bedrooms, bathrooms, nearbyHospitals, nearbyColleges };

    const { updatedProperty, updatedAttributes } = await Property.prototype.updatePropertyWithAttributes(id, propertyData, attributesData);

    return res.status(200).json(new ApiResponse(200, { updatedProperty, updatedAttributes }, "updateProperty"));
});

const deleteProperty = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const propertydatafromDataBase = await Property.findById(id);
    if (!propertydatafromDataBase)
        throw new ApiError(404, "Property not found");

    if (!req.user._id.equals(propertydatafromDataBase.userId)) {
        throw new ApiError(400, "You don't have access to delete this property");
    }
    const { deletedProperty, deletedAttributes } = await Property.prototype.deletePropertyWithAttributes(id);
    return res
        .status(200)
        .json(new ApiResponse(200, { deletedProperty, deletedAttributes }, "deleteProperty"));
});

export { getPropertiesForSeller, addProperty, updateProperty, deleteProperty }