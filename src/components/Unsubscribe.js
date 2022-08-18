import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const drawerWidth = 240;
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Unsubscribe = (props) => {
  const { setIsLoading } = props;
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState(null);
  const [userExist, setUserExist] = useState([]);
  const [userInfo, setUserInfo] = useState({});

  const sendData = () => {
    setIsLoading(true);
    fetch(`https://us-central1-almalevisol.cloudfunctions.net/app/api/v1/subscribers/${userInfo["_id"]}`, {
      method: "PUT",
      body: JSON.stringify({
        "is_disabled": true
    }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        setIsLoading(false);
        setIsSnackbarOpen(true);
        setAlertSeverity("success");
        setSnackbarMessage("Unsubscribed succesfully");
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const fetchData = (field, value) => {
    const url = `https://us-central1-almalevisol.cloudfunctions.net/app/api/v1/subscribers/field/${field}/${value}`;
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        if (res && res.length > 0 && res[0][field] === value) {
          setUserExist(true);
          setUserInfo( res[0] )
          setIsLoading(false);
        }
      });
  };

  useEffect(() => {
    const params = new URL(document.location).searchParams;
    if( params.has("id") ){
        fetchData("hash", params.get("id"));
    }
  }, []);

  return (
    <>
      <main
        style={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          marginTop: 50,
          padding: 20,
        }}
      >
        <section
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {userExist ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <p style={{ fontSize: 50 }}>
                {" "}
                We are sad that you have to leave...!{" "}
              </p>
              <p style={{ fontSize: 50 }}> Plase answer this questions </p>

              <Button
                variant="contained"
                component="label"
                onClick={() => sendData()}
              >
                Unsubscribe me
              </Button>
            </div>
          ) : (
            <p> Opsss, wrong request </p>
          )}
        </section>
      </main>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isSnackbarOpen}
        onClose={handleClose}
        autoHideDuration={5000}
      >
        <Alert
          onClose={handleClose}
          severity={alertSeverity || "success"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
