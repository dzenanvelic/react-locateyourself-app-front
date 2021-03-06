
import './App.css';
import { useEffect, useState } from 'react';
import {Room, Star,} from "@material-ui/icons"
import ReactMapGL, {Marker,Popup} from 'react-map-gl';
import axios from 'axios';
import {format} from 'timeago.js'
import Register from './components/login/register/Register';
import Login from './components/login/Login';
function App() {
  const myStorage = window.localStorage;
  const [currentUser,setCurrentUser]=useState(myStorage.getItem("mapuser"))
  const [pins, setPins]=useState([])
  const [title, setTitle]=useState(null)
  const [desc, setDesc]=useState(null)
  const [rating, setRating]=useState(0)
  const [currentPlaceId,setCurrentPlaceId]=useState(null)
  const[newPlace,setNewPlace]= useState(null)
   const [showRegister,setShowRegister]= useState(false)
    const [showLogin,setShowLogin]= useState(false)
  const [viewport, setViewport] = useState({
    width: "100vw",
    height:"100vh",
    latitude: 46,
    longitude: 17,
    zoom: 4
  });

  useEffect(()=>{
const getPins = async()=>{
  try {
    const res = await axios.get('/pins')
setPins(res.data)
  } catch (error) {
    console.log("GET PINS ERROR",error);
  }
}
getPins()
  },[])
  const handleMarkerClick=(id,lat,long)=>{
setCurrentPlaceId(id)
setViewport( {...viewport,latitude:lat,longitude:long})
  }
  const handleMapClick=(e)=>{
const[long,lat]= e.lngLat;
setNewPlace({lat ,
      long})
  }
  const handleSubmit=async(e)=>{
e.preventDefault()
const newPin={
  username:currentUser,
  title,
  desc,
  rating,
  lat:newPlace.lat,
  long:newPlace.long

}
try {
  const res = await axios.post('/pins',newPin)
  setPins([...pins, res.data])
  setNewPlace(null)
} catch (error) {
  console.log("SEND NEW PIN ERROR",error);
}
 
  }
  //console.log("|SET REGISTER",showRegister);
  const handleLogout=()=>{
    myStorage.removeItem("mapuser");
    setCurrentUser(null)
  }
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
     <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport) }mapStyle="mapbox://styles/dzenan76/ckrz7balt3uxx18mu2y42n8in" onDblClick={handleMapClick} transitionDuration="200"
    >
  {pins.map((p)=>{
      
       return  <>
       <Marker latitude={p.lat} longitude={p.long} offsetLeft={-viewport.zoom * 3.5} offsetTop={-viewport.zoom * 7}>
        <div><Room style={{fontSize:viewport.zoom * 7,color:p.username === currentUser ? "tomato" : "slateblue",cursor:'pointer'}} onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}/></div>
          </Marker>
          {p._id === currentPlaceId && <Popup latitude={p.lat} longitude={p.long} closeButton={true}closeOnClick={true} onClose={()=>setCurrentPlaceId(null)} anchor="left"
      >
 <div className="card">
   <label>Place</label>
   <h4 className="place">{p.title}</h4>
   <label>Review</label>
   <p className="desc">{p.desc}</p>
   <label>Rating</label>
   <div className="stars">{
     Array(p.rating).fill(<Star className="star"/>)
   }

  
   </div>
   
   <label>Info</label>
   <span className="username">Created by <b>{p.username}</b></span>
   <span className="date">{format(p.createdAt)} </span>
 </div>
      </Popup> }
       
        </> 
        }
        )
       
      
        }
        {newPlace && <Popup latitude={newPlace.lat} longitude={newPlace.long} closeButton={true}closeOnClick={false} onClose={()=>setCurrentPlaceId(null)} anchor="left"
        onClose={()=>setNewPlace(null)}
      >
<div>
  {currentUser && <form onSubmit={handleSubmit}>
    <label >Title</label>
    <input placeholder="Enter a title" onChange={(e)=>setTitle(e.target.value)}></input>
    <label >Review</label>
    <textarea placeholder="Say us something about this place"onChange={(e)=>setDesc(e.target.value)}></textarea>
    <label >Rating</label>
    <select onChange={(e)=>setRating(e.target.value)}>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
    <button className="submitButton" type="submit" >Add Pin</button>

  </form>}
  
</div>
      </Popup> }
      {currentUser ? (<button className="button logout"onClick={handleLogout}>Logout</button>)  : (<div className="buttons">
        <button className="button log" onClick={()=>setShowLogin(true)}>Login</button>
     {  <button className="button reg"onClick={()=>setShowRegister(true)}>Register</button> } </div>) }
     
     
    {showRegister ? <Register setShowRegister={setShowRegister}/>: ''} 
     {showLogin &&  <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>}
    
    </ReactMapGL>
    
    </div>
     
  );
}

export default App;
