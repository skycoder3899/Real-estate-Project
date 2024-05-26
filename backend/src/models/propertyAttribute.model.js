import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"
const propertyAttributeSchema = new mongoose.Schema({
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    bedrooms: {
      type: Number,
      required: true
    },
    bathrooms: {
      type: Number,
      required: true
    },
    nearbyHospitals: {
      type: String,
      maxlength: 255
    },
    nearbyColleges: {
      type: String,
      maxlength: 255
    }
  });
propertyAttributeSchema.plugin(aggregatePaginate);
export const PropertyAttribute = mongoose.model("PropertyAttribute", propertyAttributeSchema)