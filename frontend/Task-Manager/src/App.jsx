import React, { useContext } from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate, Outlet} from 'react-router-dom'
import Dashboard from './pages/User/Dashboard'
import ManageTasks from './pages/User/ManageTasks'
import CreateTask from './pages/User/CreateTasks'
import MyTasks from './pages/User/MyTasks'
import ViewTaskDetails from './pages/User/ViewTaskDetails'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import PrivateRoute from './routes/PrivateRoute'
import UserProvider, { UserContext } from './context/userContext'
import { Toaster } from 'react-hot-toast'
const App = () => {

  return (
    <UserProvider>
    <div >
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />

          {/* Admin routes */}
          
          
         <Route element={<PrivateRoute/>}>

            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/edit/tasks" element={<ManageTasks/>}/>
            <Route path="/create-task" element={<CreateTask/>}/>
            <Route path="/update/tasks" element={<MyTasks/>}/>
            <Route path="/update/task-details/:id" element={<ViewTaskDetails/>}/>

          </Route>

          {/* user routes */}

{/* default route */}
            <Route path="/" element={<Root/>} />
        </Routes>
      </Router>

    </div>
    <Toaster
    toastOptions={{
      className:"",
      style:{
        fontSize:"13px"
      },
    }}/>
    </UserProvider>
  )
}

export default App


const Root =()=>{
  const {user, loading} = useContext(UserContext)
  if(loading) return <Outlet/>
  if(!user){
    return <Navigate to="/login"/>
  }

  return <Navigate to="/dashboard"/>;
}