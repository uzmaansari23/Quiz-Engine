import React from 'react';
import Button from './Button';
const OTPField = ({ value, onChange, sendOTP, validateOTP }) => {
  return (
    <>
      <div className="form-group">
      <Button label="Send OTP" onClick={sendOTP} />
      </div>
      <div className="form-group">
        <label htmlFor="otp">Enter OTP:</label>
        <input
          type="text"
          className="form-control"
          id="otp"
          placeholder="Enter OTP"
          value={value}
          onChange={onChange}
          required
        />
      </div>
      <div className="form-group">
      <Button label="Validate OTP" onClick={validateOTP} />
      </div>
    </>
  );
};

export default OTPField;