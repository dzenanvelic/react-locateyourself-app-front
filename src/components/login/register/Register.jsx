import { Cancel, Room } from '@material-ui/icons'
import axios from 'axios'
import React, { useRef, useState } from 'react'
import './register.css'
function Register({setShowRegister}) {
    const[success,setSuccess]= useState(false)
    const[error,setError]= useState(false)
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
   
    const handleSubmit=async(e)=>{
e.preventDefault()
const newUser={
    username:nameRef.current.value,
    email:emailRef.current.value,
    password:passwordRef.current.value
}
try {
      axios.post('/users/register',newUser)
    setError(false)
    setSuccess(true)
} catch (error) {
    console.log('====================================');
    console.log("USER CREATE ERROR",error);
    console.log('====================================');
    setError(true)
}
    }
    return (
        <div className="register">
            <div className="logo">
                <Room/>PinSelf
            </div>
            <form  onSubmit={handleSubmit}>
                <input type="text" placeholder="username"ref={nameRef}/>
                <input type="email"placeholder="email"ref={emailRef}/>
                <input type="password" placeholder="password"ref={passwordRef}/>
                <button className="submitButton"type="submit">Register</button>
                {success &&  <span className="success">Successfull.You can login now!</span>}
               {error &&  <span className="failure">Something went wrong!</span>}
               
            </form>
            <Cancel className="registerCancel" onClick={()=>setShowRegister(false)}/>
        </div>
    )
}

export default Register
