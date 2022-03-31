import mongoose from 'mongoose';

const { Schema } = mongoose;


const pointSchema = new Schema({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  });

export {
    pointSchema
}
  