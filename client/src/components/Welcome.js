import axios from "axios";
import React, { useEffect, useState } from "react";
import { TextField, Box, Button, Typography } from "@mui/material";
axios.defaults.withCredentials = true;
let firstRender = true;

const Welcome = () => {
  const [user, setUser] = useState();
//     const refreshToken = async() =>{
//         const res =await axios.get("http://localhost:5000/api/refresh", {
//         withCredentials: true    
//     }).catch(err => console.log(err))
//     const data = await res.data;
//     return data;
//     }
  const sendRequest = async () => {
    const res = await axios
      .get("http://localhost:5000/api/user", {
        withCredentials: true,
      })
      .catch((err) => console.log(err));
    const data = await res.data;
    return data;
  };
//   useEffect(() => {
//     if(firstRender){
//         firstRender = false
//         sendRequest().then((data) => setUser(data.user));
//     }
//     let interval = setInterval(() =>{
//         refreshToken().then(data=>setUser(data.user))
//     }, 1000*28)
//     return () => clearInterval(interval)
//   
useEffect(() => {
    sendRequest().then((data) => setUser(data.user));
}, []);
  return <div>
          <Box
          marginLeft="auto"
          marginRight="auto"
          width={300}
          display="flex"
          flexDirection={"column"}
          justifyContent="center"
          alignItems="center"
        >
            {user && <h1>{user.name}</h1>}
        </Box>

  </div>;
};

export default Welcome;
