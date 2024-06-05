import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import Button from '../../Components/Button';
import './ForgotPassword.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import InputField from '../../Components/InputField';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValidated, setOtpValidated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const addFakeEntryToHistory = () => {
      window.history.pushState(null, null, location.pathname);
    };

    const handlePopState = () => {
      addFakeEntryToHistory();
      navigate(location.pathname, { replace: true });
    };

    addFakeEntryToHistory();

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname, navigate]);

  useEffect(() => {
    const initializeEmailJS = async () => {
      try {
        await emailjs.init("ll-UR4HIJjPA_lFGF");
        console.log("EmailJS initialized successfully!");
      } catch (error) {
        console.error("Error initializing EmailJS:", error);
      }
    };

    initializeEmailJS();
  }, []);

  const sendOTP = async () => {
    try {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      const response = await fetch("http://localhost:5000/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (!data.exists) {
        alert("The provided email does not exist.");
        return;
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      console.log(otp);

      await emailjs.send("service_shd3mgh", "template_gduuuhh", {
        to_email: email,
        otp: otp,
      });

      console.log("OTP sent successfully");
      alert("OTP sent to your email.");

      setOtpSent(true);

      const updateResponse = await updateOTPInDatabase(email, otp);
      console.log("OTP updated in database:", updateResponse);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Error sending OTP. Please try again later.");
    }
  };

  const updateOTPInDatabase = async (email, otp) => {
    try {
      const response = await fetch("http://localhost:5000/update-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newOTP: otp }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.text();
    } catch (error) {
      console.error("Error updating OTP:", error);
      throw error;
    }
  };

  const validateOTP = async () => {
    try {
      const response = await fetch("http://localhost:5000/validate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, enteredOTP: otp }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.text();
      alert(data);
      setOtpValidated(true);
    } catch (error) {
      console.error("Error validating OTP:", error);
      alert("Error validating OTP. Please try again later.");
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword, otp }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      alert("Password updated successfully!");
      navigate('/login');
    } catch (error) {
      console.error("Error resetting password:", error);
      alert('Error resetting password. Please try again later.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!otpSent) {
      alert("Please send OTP first.");
      return;
    }
    if (!otpValidated) {
      alert("Please validate OTP first.");
      return;
    }
    await resetPassword();
  };

  return (
    <div className='bg3'>
      <div className="container mt-5 d-flex justify-content-center" style={{ maxWidth: '600px' }}>
        <div className="card w-100" style={{ backgroundColor: '#CCE6FF' }}>
          <div className="card-header text-center">
            <h3>Reset Password</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <InputField
                label="Email address:"
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {otpSent && !otpValidated && (
                <>
                  <InputField
                    label="Enter OTP:"
                    type="text"
                    id="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <button type="button" className="btn btn-primary w-50 mb-3" onClick={validateOTP}>Validate OTP</button>
                </>
              )}
              {!otpSent && (
                <button type="button" className="btn btn-primary w-50 mb-3" onClick={sendOTP}>Send OTP</button>
              )}
              {otpValidated && (
                <>
                  <InputField
                    label="New Password:"
                    type="password"
                    id="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <InputField
                    label="Confirm New Password:"
                    type="password"
                    id="confirmNewPassword"
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />
                  <center><Button label="Reset Password" type="submit" onClick={handleSubmit} /></center>
                </>
              )}
              <br />
              <center><Link to="/login">Back to Login</Link></center>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
