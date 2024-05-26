import mongoose, { Schema } from "mongoose";

const interestedBuyerSchema = new mongoose.Schema({
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    interest_date: {
      type: Date,
      default: Date.now
    }
  });

  export const InterestedBuyer = mongoose.model("InterestedBuyer", interestedBuyerSchema)