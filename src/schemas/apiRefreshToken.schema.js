import mongoose from 'mongoose';

/**
 * Refresh Token Schema
 * @private
 */
const apiRefreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  apiName: {
    type: 'String',
    unique: true,
    require: true,
  },
  expiresIn: {
    type: Date,
    require: true,
  },
});

export default apiRefreshTokenSchema;
