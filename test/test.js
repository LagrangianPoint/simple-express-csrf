import { expect } from 'chai';
import { mockRequest, mockResponse } from 'mock-req-res';
import { generateCSRFToken, validateCSRFToken, validateCSRFMiddleware} from '../dist/index.js';
import sinon from 'sinon';

describe('generateCSRFToken', () => {
  it('should generate a new csrf_token and csrf_secret and store them in session', () => {
    const req = mockRequest({
      session: {
      }
    });
    const token = generateCSRFToken(req);

    expect(token).to.exist;
    expect(req.session.csrf_token).to.exist;
    expect(req.session.csrf_secret).to.exist;
    expect(token).to.have.lengthOf.at.least(5);
    expect(req.session.csrf_token).to.have.lengthOf.at.least(5);
    expect(req.session.csrf_secret).to.have.lengthOf.at.least(5);
    expect(token).to.equal(req.session.csrf_token);
    expect(token).not.to.equal(req.session.csrf_secret);
    expect(req.session.csrf_token).not.to.equal(req.session.csrf_secret);
  });
});

describe('validateCSRFToken', () => {
  it('returns true if token is valid', () => {
    const req = mockRequest({
      session: {
      },
      body: {
      }
    });

    const token = generateCSRFToken(req);
    req.body.csrf_token = token; // Emulating POST form submission

    const result = validateCSRFToken(req);

    expect(result).to.be.true;
  });

  it('returns false if the same token is used twice', () => {
    const req = mockRequest({
      session: {
      },
      body: {
      }
    });

    const token = generateCSRFToken(req);
    req.body.csrf_token = token;
    let result = validateCSRFToken(req);
    expect(result).to.be.true;

    req.body.csrf_token = token;
    result = validateCSRFToken(req);
    expect(result).to.be.false;
  });

  it('returns false with corrupted token', () => {
    const req = mockRequest({
      session: {
      },
      body: {
      }
    });

    const token = generateCSRFToken(req);
    req.body.csrf_token = token + "CORRUPTED"; // Emulating POST form submission

    const result = validateCSRFToken(req);

    expect(result).to.be.false;
  });

});

describe('validateCSRFMiddleware', () => {
  it('should call next() for a valid token', () => {
    const req = mockRequest({
      session: {
      },
      body: {
      }
    });
    const res = mockResponse({});
    const nextSpy = sinon.spy();
    const token = generateCSRFToken(req);
    req.body.csrf_token = token;
  
    const middleware = validateCSRFMiddleware();

    middleware(req, res, nextSpy);
    expect(nextSpy.called).to.be.true;
  });

  it('should call the callback when the token is invalid', () => {
    const req = mockRequest({
      session: {
      },
      body: {
      }
    });
    const res = mockResponse({});
    const nextSpy = sinon.spy();
    const token = generateCSRFToken(req);
    req.body.csrf_token = token + "INVALID";

    let errorMessage = "";
  
    const middleware = validateCSRFMiddleware((error) => {
      errorMessage = error.message;
    });

    middleware(req, res, nextSpy);
    
    expect(errorMessage).to.equal('CSRF Token is invalid');
  });

  it('should call return status 401 when the token is invalid', () => {
    const req = mockRequest({
      session: {
      },
      body: {
      }
    });
    
    const sendStatusSpy = sinon.spy();
    const res = mockResponse({
      sendStatus: sendStatusSpy
    });
    const nextSpy = sinon.spy();

    const token = generateCSRFToken(req);
    req.body.csrf_token = token + "INVALID";
  
    const middleware = validateCSRFMiddleware();

    middleware(req, res, nextSpy);

    expect(sendStatusSpy.called).to.be.true;
    expect(sendStatusSpy.calledWith(401)).to.be.true;
    
  });
});