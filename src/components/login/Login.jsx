import { Cancel, Room } from '@material-ui/icons'
import axios from 'axios'
import React, { useRef, useState } from 'react'
import './login.css'
function Login({setShowLogin,myStorage,setCurrentUser}) {
    
    const[error,setError]= useState(false)
    const nameRef = useRef()
   
    const passwordRef = useRef()
   
    const handleSubmit=async(e)=>{
e.preventDefault()
const user={
    username:nameRef.current.value,
   
    password:passwordRef.current.value
}
try {
    const res = await axios.post('/users/login',user)
      myStorage.setItem("mapuser",res.data.username)
      setCurrentUser(res.data.username)
      setShowLogin(false)
    setError(false)
    
} catch (error) {
    console.log('====================================');
    console.log("USER CREATE ERROR",error);
    console.log('====================================');
    setError(true)
}
    }
    return (
        <div className="login">
            <div className="logo">
                <Room/>PinSelf
            </div>
            <form  onSubmit={handleSubmit}>
                <input type="text" placeholder="username"ref={nameRef}/>
               
                <input type="password" placeholder="password"ref={passwordRef}/>
                <button className="loginButton"type="submit">Login</button>
              
               {error &&  <span className="failure">Something went wrong!</span>}
               
            </form>
            <Cancel className="registerCancel" onClick={()=>setShowLogin(false)}/>
        </div>
    )
}

export default Login

