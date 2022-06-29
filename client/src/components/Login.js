import { TextField, Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const Login = () => {
    const history = useNavigate();
    const [inputs, setInputs] = useState({ 
        email: "", 
        password: "",
    })
    const handleChange = (e) => {
        setInputs((prev) => ({
            ...prev, 
            [e.target.name]: e.target.value,
        }));
    };
const sendRequest = async() =>{
    const res = await axios.post('http://localhost:5000/api/login', {
        //send to server
        email: inputs.email, 
        password: inputs.password
    }).catch(err => console.log(err));
    //to get the data from the request
    const data = await res.data;
    return data;
}
  const handleSubmit = (e) => {
    e.preventDefault();
    //send http request
    sendRequest().then(() => history("/user")) //callback function to redirect the user to the user page
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          marginLeft="auto"
          marginRight="auto"
          width={300}
          display="flex"
          flexDirection={"column"}
          justifyContent="center"
          alignItems="center"
        >
        <Typography variant="h2">Login</Typography>

          <TextField name="email" onChange={handleChange} type={'email'} value={inputs.email} variant="outlined" placeholder = "Email" margin="normal" />
          <TextField name="password" onChange={handleChange} type={'password'} value={inputs.password} variant="outlined" placeholder = "Password" margin="normal" />
          <Button variant="contained" type="submit">Login</Button>
        </Box>
      </form>
    </div>
  );
}

export default Login