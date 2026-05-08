
import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice'
import InterviewPage from './pages/InterviewPage'
import InterviewHistory from './pages/InterviewHistory'
import Pricing from './pages/Pricing'
import InterviewReport from './pages/InterviewReport'
import Success from "./pages/Success";

// ✅ FIX 1: use env instead of hardcoding
export const ServerUrl = import.meta.env.VITE_SERVER_URL;
//|| "http://localhost:8000"

const App = () => {
  const dispatch = useDispatch()
   useEffect(() => {
      const getUser = async () => {
        try {
          const token = localStorage.getItem("token");
          const result = await axios.get(
            ServerUrl + "/api/user/current-user",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
          dispatch(setUserData(result.data))
  
        } catch (error) {
          console.log("User fetch error:", error.response?.data || error.message)
  
          //  handle 400 safely
          dispatch(setUserData(null))
        }
      }
  
      getUser()
    }, [dispatch])

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth' element={<Auth />} />
      <Route path="/success" element={<Success />} />
      <Route path='/interview' element={<InterviewPage />} />
      <Route path='/history' element={<InterviewHistory />} />
      <Route path='/pricing' element={<Pricing />} />
      <Route path='/report/:id' element={<InterviewReport />} />
    </Routes>
  )
}

export default App
