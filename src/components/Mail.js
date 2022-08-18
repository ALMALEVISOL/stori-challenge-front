import React, { useEffect, useState } from "react";
import { Button, TextareaAutosize } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Mail = (props) => {
  const drawerWidth = 240;
  const [htmlContent, setHtmlContent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [susbscribers, setSubscribers] = useState([]);
  const [mailReponse, setMailResponse] = useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const fetchData = () => {
    fetch("https://us-central1-almalevisol.cloudfunctions.net/app/api/v1/subscribers")
      .then((res) => res.json())
      .then((res) => {
        setSubscribers(res);
      });
  };

  const sendData = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("htmlContent", htmlContent);
    fetch("https://us-central1-almalevisol.cloudfunctions.net/app/api/v1/mail", {
      method: "POST",
      body: formData,
    })
    setIsSnackbarOpen(true);
    setAlertSeverity("info");
    setSnackbarMessage("Send mail request sent, please check logs");
  };

  return (
    <>
      <main
        style={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          marginTop: 50,
          padding: 20,
          position: "relative",
        }}
      >
        <section
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <p style={{ margin: 0 }}>
            {" "}
            Total of subscribers: {susbscribers.length}{" "}
          </p>
          <div
            style={{
              display: "flex",
              marginBottom: 20,
            }}
          >
            {susbscribers.map((user) => (
              <div
                style={{
                  border: "1px solid blue",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                  height: 55,
                  fontSize: 12,
                }}
              >
                <p style={{ margin: 0 }}> {user["email"]} </p>
                <p style={{ margin: 0 }}> {user["name"]} </p>
              </div>
            ))}
          </div>
        </section>
        <div  style={{ display: "flex", justifyContent: "space-between" }} >
        <p> {"Hint: You can write this text and the system will replace with the full name of every user: ${name}"} </p>
        <Button
          variant="contained"
          onClick={sendData}
          style={{ justifyContent: "right", float: "right", marginBottom: 10 }}
        >
          Send email
        </Button>
        </div>
        <TextareaAutosize
          aria-label="empty textarea"
          placeholder="Paste your HTML template"
          style={{ width: "100%", height: 200, overflow: "auto" }}
          onChange={(e) => setHtmlContent(e.target.value)}
        />
        <section
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Button
              variant="contained"
              component="label"
              style={{ width: 170 }}
            >
              PNG or PDF file
              <input
                hidden
                accept="image/*"
                multiple
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </Button>
            <span> {selectedFile?.name} </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Button
              variant="contained"
              component="label"
              style={{ width: 170 }}
            >
              HTML Template
              <input
                hidden
                accept="image/*"
                multiple
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </Button>
            <span> {selectedFile?.name} </span>
          </div>
        </section>

        {mailReponse && (
          <section
            style={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <pre style={{ fontSize: 10 }}>
              {JSON.stringify(mailReponse, null, 2)}
            </pre>
          </section>
        )}
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
