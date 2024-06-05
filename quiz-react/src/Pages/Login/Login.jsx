import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import Button from '../../Components/Button';
import UserContext from '../../Components/UserContext';
import InputField from '../../Components/InputField';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client'); // Default to 'client' or 'admin'
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);
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

  const validateLoginForm = () => {
    if (!email || !password || role === 'select') {
      alert('Please fill in all fields.');
      return false;
    }
    return true;
  };

  const submitLoginForm = async (event) => {
    event.preventDefault();

    if (!validateLoginForm()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message);

        // Replace the history entry
        if (role === 'client') {
          navigate("/welcome", { state: { email }, replace: true });
        } else if (role === 'admin') {
          navigate('/admin', { replace: true });
        }

        setUserData({
          email,
          username: data.username,
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg2">
      <div className="container mt-5 d-flex justify-content-center" style={{ maxWidth: '500px' }}>
        <div className="card w-100" style={{ backgroundColor: '#CCE6FF' }}>
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Login</h2>
            <p className="card-title text-center mb-4">
              Don't have an account? <Link to="/signup">Signup</Link>
            </p>
            <form onSubmit={submitLoginForm}>
              <InputField
                label="Email address"
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <InputField
                label="Password"
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-end mt-2">
                <Link to="/forgotpassword">Forgot Password?</Link>
              </div>
              <InputField
                label="Role"
                type="select"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                options={[
                  { value: 'client', label: 'Client' },
                  { value: 'admin', label: 'Admin' },
                ]}
              />
              <center><Button label="Login" type="submit" onClick={submitLoginForm}/></center>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
