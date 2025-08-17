import React, { useState, useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import {Link, useNavigate} from 'react-router-dom'
import Input from '../../components/Inputs/Input'
import { validateEmail } from '../../utils/helper'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import axiosInstance from '../../utils/axiosInstance'
import uploadImage from '../../utils/uploadImage'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/userContext'
const Signup = () => {
  const [profilePic, setProfilePic] = useState(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // const [adminInviteToken, setAdminInviteToken] = useState("")

  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const {updateUser} = useContext(UserContext)

  //handle login form submit

  const handleSignUp = async(e) =>{
    e.preventDefault();

    let profileImageUrl = ''
    if(!fullName){
      setError("please enter fullName.")
      return
    }
    if(!validateEmail(email)){
      setError("please enter a  valid email address.")
      return
    }
    if(!password){
      setError("please enter the password.")
      return
    }
    setError("")

    //signup api call

     try{
      //upload image if available

      if(profilePic){
        const imageUploadRes = await uploadImage(profilePic);
        profileImageUrl = imageUploadRes.imageUrl || ""
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        name:fullName,
        email,
        password,
        profileImageUrl,

      });

      const {token, role}= response.data

      if(token){
        localStorage.setItem("token", token)
        updateUser(response.data)
        
        navigate("/admin/dashboard")
      
      }
    }catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message)
      }else{
        setError("something went wrong, please try again")
      }
    }
  }
  

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'> Create an account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          join us by entering your details
        </p>

        <form action="" onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}/>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

            <Input value={fullName}
          onChange={({target})=>setFullName(target.value)}
          label = "full name"
          placeholder = "johndoe"
          type = "text"
          />
          <Input value={email}
          onChange={({target})=>setEmail(target.value)}
          label = "Email Address"
          placeholder = "johndoe@example.com"
          type = "text"
          />

          <Input value={password}
          onChange={({target})=>setPassword(target.value)}
          label = "Password"
          placeholder = "min 8 characters"
          type = "password"
          />

          
          
          </div>
          
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type="submit" className='btn-primary'>
            SignUp
          </button>
          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account?{" "}
            <Link className='font-medium text-primary underline' to="/login">
            Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Signup