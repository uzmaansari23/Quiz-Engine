import React from 'react';
import Admin from './Pages/Admin/Admin';
import './Pages/Admin/Admin.css'; 
import { BrowserRouter, Route, RouterProvider, Routes, createBrowserRouter } from 'react-router-dom';
import QuizTable from './Pages/QuizTable/QuizTable';
import AddQuestionForm from './Pages/AddQuestion/AddQuestionForm';
import Layout from './Components/Layout';
import SignUpForm from './Pages/Signup/SIgnup';
import LoginForm from './Pages/Login/Login';
import QuizInstructions from './Pages/Welcome/Welcome';
import { UserProvider } from './Components/UserContext';
import ResetPasswordForm from './Pages/ForgotPassword/ForgotPassword';
import Quiz from './Pages/Quiz/Quiz';
import QuizPreviewPage from './Pages/Preview/Preview';



function App() {

  const router = createBrowserRouter([
    {
     path:"/",
     element: <Layout/>,
     children:[
      {
        index: true,
        element:<SignUpForm/>
      },
      {
        path:"/admin",
        element:<Admin/>
      },
      {
        path:"/welcome",
        element:<QuizInstructions/>
      }
     
     ]
     
    },
    {
      path:"/signup",
      element:<SignUpForm/>
    },
    {
      path:"/login",
      element:<LoginForm/>
    },
    {
      path:"/welcome",
      element:<QuizInstructions/>
    },
    {
      path:"/quizTable",
      element:<QuizTable/>
    },
    {
      path:"/addQuestionForm",
      element:<AddQuestionForm/>
    },
    {
      path:"/forgotpassword",
      element:<ResetPasswordForm/>
    },
    {
      path:"/quiz/:subject",
      element:<Quiz/>
    },
    {
      path:"/preview",
      element:<QuizPreviewPage/>
    }
   
   
  ]);


  return (
    <UserProvider>
      <RouterProvider router={router}/>
      </UserProvider>
  );
}

export default App;
