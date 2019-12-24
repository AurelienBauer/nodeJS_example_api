import mongoose from 'mongoose';

/**
 * Refresh Token Schema
 * @private
 */
const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  userEmail: {
    type: 'String',
    unique: true,
    require: true,
  },
  expiresIn: {
    type: Date,
    require: true,
  },
});

export default refreshTokenSchema;
