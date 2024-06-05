import React, { useEffect } from 'react';
import './Admin.css'; // Import your CSS file
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Admin() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const addFakeEntryToHistory = () => {
      window.history.pushState(null, null, location.pathname);
    };

    const handlePopState = (event) => {
      event.preventDefault();
      addFakeEntryToHistory();
      navigate(location.pathname, { replace: true });
    };

    addFakeEntryToHistory();
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname, navigate]);

  return (
    <div className='bg5'>
      <div className="">
        <h1 className="welcome">Welcome Admin!</h1>
        <div className="options">
          <Link to="/quizTable"><button>Preview Questions</button></Link>
          <Link to="/addQuestionForm"><button>Add Questions</button></Link>
        </div>
        <div className="signout">
          <Link to="/login"><button>Sign Out</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Admin;
