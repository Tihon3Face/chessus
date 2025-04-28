import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function CustomDialog({open, children, title, contentText, handleContinue, handleClose, disabled, redirect, isForm }) {
  return (
    <Dialog open={open} sx={title == "Sign up" || title == "Sign in" ? {background: "white"} : null}> {/*dialog container*/}
      <DialogTitle>{title}</DialogTitle>
      <DialogContent> {/* Main body of modal/dialog */}
        <DialogContentText> {/* main text */}
          {contentText}
        </DialogContentText>
        {children} {/* Other content */}
      </DialogContent>
      <DialogActions sx={title == "Sign up" || title == "Sign in" ? {justifyContent:"space-between",px:2} : null}> {/* Dialog action buttons */}
        {/* Force users to make input without option to cancel */}
        {title == "Sign up" ? <Button onClick={redirect} disabled={disabled}>Sign in</Button> : null}
        {title == "Sign in" ? <Button onClick={redirect} disabled={disabled}>Sign up</Button> : null}
        <Stack sx={{display:"flex",flexDirection:"row"}}>
          {isForm ? <Button onClick={handleClose} disabled={disabled}>Go back</Button> : null}
          <Button onClick={handleContinue} disabled={disabled}>Continue</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}