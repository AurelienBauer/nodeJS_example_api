import mongoose from 'mongoose';
import httpStatus from 'http-status';
import moment from 'moment-timezone';
import refreshTokenSchema from '../schemas/refreshToken.schema';
import ErrorApi from '../services/ErrorApi.service';
import { generateRefreshToken } from '../services/auth.service';

class RefreshTokenModel {}

refreshTokenSchema.statics = {
  async generateAndInsertRefreshToken({
    email, id = null,
  }) {
    try {
      let refreshToken = await this.findOne({ userEmail: email });

      if (refreshToken) {
        if (Date.parse(moment().toDate()) > Date.parse(refreshToken.expiresIn)) {
          refreshToken.delete();
        } else {
          return { token: refreshToken.token, expiresIn: refreshToken.expiresIn };
        }
      }
      refreshToken = generateRefreshToken(email);
      await new this({
        token: refreshToken.token,
        userEmail: email,
        userId: id,
        expiresIn: refreshToken.expiresIn,
      }).save();
      return { refreshToken };
    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        return new ErrorApi({
          message: 'A refreshToken already exit for this user, use the refreshToken or logout route instead',
          status: httpStatus.FORBIDDEN,
          isPublic: true,
        });
      }
      return new ErrorApi(err);
    }
  },
};

refreshTokenSchema.loadClass(RefreshTokenModel);

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
