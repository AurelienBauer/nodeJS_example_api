import mongoose from 'mongoose';
import moment from 'moment-timezone';
import apiRefreshTokenSchema from '../schemas/apiRefreshToken.schema';
import { logger } from '../services/logger.service';

class ApiRefreshTokenModel {}

apiRefreshTokenSchema.statics = {
  insertRefreshTokenIfNeeded(apiName, refreshToken) {
    this.findOne({ apiName }, (err, res) => {
      if (err) {
        logger.warn('Error on find api refresh token');
        return;
      }
      if (res) {
        if (Date.parse(moment().toDate()) > Date.parse(res.expiresIn)) {
          res.delete();
        } else return;
      }
      logger.info(`Save a new refresh token for ${ apiName}`);
      new this({
        token: refreshToken.token,
        apiName,
        expiresIn: refreshToken.expiresIn,
      }).save();
    });
  },
};

apiRefreshTokenSchema.loadClass(ApiRefreshTokenModel);

const ApiRefreshToken = mongoose.model('ApiRefreshToken', apiRefreshTokenSchema);
export default ApiRefreshToken;
