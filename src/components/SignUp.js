import axios from "axios";
import { SnackbarProvider, useSnackbar } from 'notistack';
import CustomDialog from "./CustomDialog";
import { TextField } from '@mui/material';
import { useState } from "react";
import { CookiesProvider} from 'react-cookie'
import { useNavigate } from "react-router";

function MySignUp({sendCookie}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [disabled,setDisabled] = useState(false);

  const {enqueueSnackbar} = useSnackbar()

  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/homepage');
  };

  const toSignIn = () => {
    navigate('/sign-in')
  }

  async function signUp () {
    await axios.post('http://localhost:8080/sign-up', {
      username: username,
      password: password,
    })
    .then(function (res) {
      console.log(res);
      enqueueSnackbar(`${res.data}`,{
        variant:'success',
        anchorOrigin:{
        horizontal:'right',
        vertical:'top'
      }})
      sendCookie(username)
      setTimeout(handleRedirect, 1000)
    })
    .catch(function ({response}) {
      enqueueSnackbar(`${response.data}`,{
        variant:'error',  // variant could be success, error, warning, info, or default
        anchorOrigin:{
        horizontal:'right',
        vertical:'top'
      }})
      console.log(response);
      setDisabled(false)
    });
  }


  return (
    <CustomDialog
      open={true} // leave open if username has not been selected
      title="Sign up" // Title of dialog
      contentText="Please create an account" // content text of dialog
      handleContinue={() => { // fired when continue is clicked
        if (!(username && password)) return; // if username hasn't been entered, do nothing
        // socket.emit("username", username); // emit a websocket event called "username" with the username as data
        setDisabled(true)
        signUp()
      }}
      handleClose={handleRedirect}
      disabled={disabled}
      redirect={toSignIn}
      isForm={true}
    >
      <TextField // Input
        margin="dense"
        id="username"
        label="Username"
        name="username"
        value={username}
        required
        onChange={(e) => setUsername(e.target.value)} // update username state with value
        type="text"
        fullWidth
        variant="standard"
      />
        <TextField // Input
        margin="dense"
        id="password"
        label="Password"
        name="password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)} // update username state with value
        type="password"
        fullWidth
        variant="standard"
      />
    </CustomDialog>
  );
}


export default function SignUp({sendCookie}) {
  return (
    <SnackbarProvider maxSnack={3}>
      <MySignUp sendCookie={sendCookie}/>
    </SnackbarProvider>
  );
}