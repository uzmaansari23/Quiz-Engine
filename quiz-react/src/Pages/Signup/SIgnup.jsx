import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import InputField from '../../Components/InputField';
import Button from '../../Components/Button';
import './Signup.css';
import emailjs from 'emailjs-com';

const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [otp, setOTP] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [otpSent, setOTPSent] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
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

  const sendOTP = async () => {
    try {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       
      if (!emailPattern.test(email)) {
        setEmailError("Please enter a valid email address.");
        return;
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem("generatedOTP", otp);
     console.log(otp);
      const response = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          otp,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await emailjs.send("service_shd3mgh", "template_gduuuhh", {
        to_email: email,
        name: username,
        otp: otp,
      }, 'll-UR4HIJjPA_lFGF');

      setOTPSent(true);
      alert("OTP sent to your email.");
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert("Error sending OTP. Please try again later.");
    }
  };

  const validateOTP = async () => {
    try {
      const response = await fetch('http://localhost:5000/validate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          enteredOTP: otp,
        }),
      });

      if (response.ok) {
        alert('OTP validated successfully.');
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setShowPasswordFields(true);
    } catch (error) {
      console.error('Error validating OTP:', error);
    }
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return false;
    }
    if (!passwordRegex.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return false;
    }
    setPasswordError('');
    return true;
  };


  const validateConfirmPassword = () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  
  const submitSignUpForm = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (!validatePassword() || !validateConfirmPassword()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
        }),
      });

      if (response.ok) {
        alert('Signed up successfully');
        navigate('/login');
      } else {
        console.error('Signup failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className='bg1'>
      <div className="container mt-5 d-flex justify-content-center" style={{ maxWidth: '600px' }}>
        <div className="card w-100" style={{ backgroundColor: '#EDC001' }}>
          <div className="card-header text-center">
            <h3>Sign Up</h3>
            <p className="card-title text-center mb-4">
              Already a user? <Link to="/login">Login</Link>
            </p>
          </div>
          <div className="card-body">
            <form onSubmit={submitSignUpForm}>
              <InputField
                label="Username"
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <InputField
                label="Email address"
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                  if (!emailPattern.test(e.target.value)) {
                    setEmailError('Invalid Email');
                  } else {
                    setEmailError('');
                  }
                }}
              />
              {emailError && <p className="error-message" style={{ color: 'red' }}>{emailError}</p>}
              
              {!showPasswordFields && !otpSent && (
                <Button label="Send OTP" onClick={sendOTP} />
              )}
              
              {!showPasswordFields && otpSent && (
                <>
                  <InputField
                    label="Enter OTP"
                    type="text"
                    id="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                  />
                  <Button label="Validate OTP" onClick={validateOTP} />
                </>
              )}
              
              {showPasswordFields && (
                <>
                  <InputField
                    label="Role"
                    type="select"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    options={[
                      { value: 'client', label: 'Client' },
                      { value: 'admin', label: 'Admin' }
                    ]}
                  />
                 <InputField
                    id="password"
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword();
                    }}
                  />
                  {passwordError && <p className="error-message" style={{ color: 'red' }}>{passwordError}</p>}
                  <InputField
                    id="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      validateConfirmPassword();
                    }}
                  />
                  {confirmPasswordError && <p className="error-message" style={{ color: 'red' }}>{confirmPasswordError}</p>}
                  <Button label="Signup" type="submit" onClick={submitSignUpForm} />
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
