import mongoose, { Schema } from "mongoose";
import {PropertyAttribute} from "./propertyAttribute.model.js"
import aggregatePaginate from "mongoose-aggregate-paginate-v2"
const propertySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 255
    },
    description: {
        type: String,
        maxlength: 255
    },
    place: {
        type: String,
        required: true,
        maxlength: 255
    },
    area: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

propertySchema.plugin(aggregatePaginate)

propertySchema.methods.createPropertyWithAttributes = async function (userId, propertyData, attributesData) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const newProperty = new this.constructor({
            userId,
            ...propertyData
        });
        const savedProperty = await newProperty.save({ session });

        const newAttributes = new PropertyAttribute({
            propertyId: savedProperty._id,
            ...attributesData
        });
        const savedAttributes = await newAttributes.save({ session });

        await session.commitTransaction();
        session.endSession();
        return { savedProperty, savedAttributes };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

propertySchema.methods.updatePropertyWithAttributes = async function (propertyId, propertyData, attributesData) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const updatedProperty = await this.constructor.findByIdAndUpdate(propertyId, propertyData, { new: true, session });

        const updatedAttributes = await PropertyAttribute.findOneAndUpdate(
            { propertyId },
            attributesData,
            { new: true, session }
        );

        await session.commitTransaction();
        session.endSession();
        return { updatedProperty, updatedAttributes };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

propertySchema.methods.deletePropertyWithAttributes = async function (propertyId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const deletedProperty = await this.constructor.findByIdAndDelete(propertyId, { session });

        const deletedAttributes = await PropertyAttribute.findOneAndDelete(
            { propertyId },
            { session }
        );

        await session.commitTransaction();
        session.endSession();
        return { deletedProperty, deletedAttributes };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

propertySchema.statics.getPropertyWithAttributes = async function (page = 1, limit = 10, filters = {}) {
    const options = {
        page,
        limit
    };

    const matchStages = [];
    if (filters.place) matchStages.push({ place: { $regex: new RegExp(filters.place, 'i') } });
    if (filters.area) matchStages.push({ area: { $lte: Number(filters.area) } });
    if (filters.bedrooms) matchStages.push({ 'attribute.bedrooms': Number(filters.bedrooms) });
    if (filters.bathrooms) matchStages.push({ 'attribute.bathrooms': Number(filters.bathrooms) });
    if (filters.hospitalsNearby) matchStages.push({ 'attribute.nearbyHospitals': { $regex: new RegExp(filters.hospitalsNearby, 'i') } });
    if (filters.collegesNearby) matchStages.push({ 'attribute.nearbyColleges': { $regex: new RegExp(filters.collegesNearby, 'i') } });

    const aggregate = this.aggregate([
        {
            $lookup: {
                from: 'interestedbuyers',
                localField: '_id',
                foreignField: 'propertyId',
                as: 'likes'
            }
        },
        {
            $lookup: {
                from: 'propertyattributes',
                localField: '_id',
                foreignField: 'propertyId',
                as: 'attribute'
            }
        },
        { $unwind: "$attribute" },
        ...(matchStages.length ? [{ $match: { $and: matchStages } }] : []),
        {
            $addFields: {
                likesCount: { $size: '$likes' }
            }
        },
        {
            $project: {
                likes: 0
            }
        },
        { $sort: { createdAt: -1 } }
    ]);

    const result = await Property.aggregatePaginate(aggregate, options);
    return result;
};



export const Property = mongoose.model("Property", propertySchema)