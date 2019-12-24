/* eslint-disable no-undef */
import httpStatus from 'http-status';
import request from 'supertest';
import chai from 'chai';
import app from '../../src/app';
import RefreshToken from '../../src/models/refreshToken.model';

const { expect } = chai;
const agent = request(app);

describe('Authentication API Integration Tests', () => {
  describe('POST login to get a token', () => {
    it('POST login  - Validation, test should fail because no body was set', (done) => {
      agent.post('/auth/login')
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body.errors).to.be.an('array');
          expect(res.body.errors.length).to.equal(2);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('POST login  - Validation, test should fail because email isn\'t a email', (done) => {
      agent.post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          email: 'isNotAnEmail',
          password: 'good password',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body.errors).to.be.an('array');
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors[0].param).to.equal('email');
          expect(res.body.success).to.equal(false);
          expect(res.body.errors[0].msg).to.equal('Invalid value');
          done();
        });
    });

    it('POST login  - Validation, test should fail because password is too short', (done) => {
      agent.post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          email: 'isAn@Email.yes',
          password: 'short',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body.errors).to.be.an('array');
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors[0].param).to.equal('password');
          expect(res.body.errors[0].msg).to.equal('Invalid value');
          done();
        });
    });

    it('POST login  - Authentication has succeeded and return a token', (done) => {
      agent.post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          email: 'isAn@Email.yes',
          password: 'goodpassword',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.OK);
          expect(res.body).to.be.an('object');
          expect(res.body.tokens).to.be.an('object');
          expect(res.body.tokens.accessToken).to.be.a('object');
          expect(res.body.tokens.accessToken.token).to.be.a('string');
          expect(res.body.tokens.accessToken.expiresIn).to.be.a('string');
          expect(res.body.tokens.refreshToken).to.be.a('object');
          expect(res.body.tokens.refreshToken.token).to.be.a('string');
          expect(res.body.tokens.refreshToken.expiresIn).to.be.a('string');
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });

  describe('POST refresh to get an access token', () => {
    let refreshToken;

    before((done) => {
      agent.post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          email: 'isAn@Email.yes',
          password: 'goodpassword',
        })
        .end((err, res) => {
          refreshToken = res.body.tokens.refreshToken.token;
          done();
        });
    });

    it('POST request access token without put the refreshToken in the body,'
        + ' it should fail and return UNAUTHORIZED', (done) => {
      agent.post('/auth/refreshToken')
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.BAD_REQUEST);
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.success).to.equal(false);
          expect(res.body.errors[0].param).to.equal('refreshToken');
          done();
        });
    });

    it('POST request access token, but a wrong refreshToken is put in the body,'
        + ' it should fail and return UNAUTHORIZED', (done) => {
      agent.post('/auth/refreshToken')
        .set('Accept', 'application/json')
        .send({
          refreshToken: 'wrong_refreshToken',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.UNAUTHORIZED);
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal('RefreshToken is not valid');
          done();
        });
    });

    it('POST request access token, the refreshToken put in the body is good,'
          + ' it should success and return an access token', (done) => {
      agent.post('/auth/refreshToken')
        .set('Accept', 'application/json')
        .send({
          refreshToken,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.OK);
          expect(res.body.success).to.equal(true);
          expect(res.body.tokens).to.be.an('object');
          expect(res.body.tokens.accessToken).to.be.a('object');
          expect(res.body.tokens.accessToken.token).to.be.a('string');
          expect(res.body.tokens.accessToken.expiresIn).to.be.a('string');
          done();
        });
    });

    it('POST request access token, but the refreshToken put in the body has expired,'
          + ' it should fail and return UNAUTHORIZED', (done) => {
      RefreshToken.updateOne({ token: refreshToken }, {
        expiresIn: '2000-01-23 11:29:14.794Z',
      }, () => {
        agent.post('/auth/refreshToken')
          .set('Accept', 'application/json')
          .send({
            refreshToken,
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(httpStatus.UNAUTHORIZED);
            expect(res.body.success).to.equal(false);
            expect(res.body.message).to.equal('refreshToken expired');
            done();
          });
      });
    });
  });

  describe('GET information about an authenticate user', () => {
    let token;

    before((done) => {
      agent.post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          email: 'isAn@Email.yes',
          password: 'goodpassword',
        })
        .end((err, res) => {
          token = res.body.tokens.accessToken.token;
          done();
        });
    });

    it('GET status should be rejected (no token send)', (done) => {
      agent.get('/auth/status')
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.UNAUTHORIZED);
          expect(res.body.message).to.equal('Auth token is not supplied');
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('GET status should be rejected (wrong token send)', (done) => {
      agent.get('/auth/status')
        .set('Authorization', `Bearer ${ token}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(httpStatus.OK);
          expect(res.body.authUser).to.be.an('object');
          expect(res.body.status).to.equal('authenticated');
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });
});
