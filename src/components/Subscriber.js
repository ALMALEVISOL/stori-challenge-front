import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Button, TextareaAutosize } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { DataGrid } from "@mui/x-data-grid";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Close from "@mui/icons-material/CloseOutlined";

const drawerWidth = 240;
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Subscriber = (props) => {
  const { setIsLoading } = props;
  const [usersArray, setUsersArray] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState(null);
  const [email, setEmail] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [susbscribers, setSubscribers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [manyResponse, setManyResponse] = useState(null);

  const style = {
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90vw",
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    p: 3,
    display: "flex",
    flexDirection: "column",
  };

  const columns = [
    { field: "email", headerName: "Email", width: 260 },
    {
      field: "name",
      headerName: "Full name",
      width: 400,
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(
      "https://us-central1-almalevisol.cloudfunctions.net/app/api/v1/brands"
    )
      .then((res) => res.json())
      .then((res) => {
        setBrands(
          res.map((brand) => ({
            ...brand,
            label: brand["full_name"],
            id: brand["_id"],
          }))
        );
        setIsLoading(false);
      });
  };

  const fetchSubscribers = () => {
    fetch(
      "https://us-central1-almalevisol.cloudfunctions.net/app/api/v1/subscribers"
    )
      .then((res) => res.json())
      .then((res) => {
        setSubscribers(res);
        setIsLoading(false);
      });
  };

  const sendData = (sendMany) => {
    if (sendMany) {
      if (!usersArray || usersArray.length === 0) {
        setSnackbarProps(true, "error", "Error, please fill your email list");
        return;
      }
    } else if (!email || email === "" || !fullName || fullName === "") {
      setSnackbarProps(true, "error", "Error, please fill the all fields");
      return;
    }
    setIsLoading(true);
    const many = usersArray
      .split(",")
      .map((user) => ({ email: user, name: user.split("@")[0] }));
    fetch(
      "https://us-central1-almalevisol.cloudfunctions.net/app/api/v1/subscribers",
      {
        method: "POST",
        body: sendMany
          ? JSON.stringify(many)
          : JSON.stringify({ email, name: fullName }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res && res["name"] && res["name"] === "ValidationError") {
          setIsLoading(false);
          setSnackbarProps(true, "error", "Error, " + res["message"]);
          return;
        }
        if (res && res["code"] === 11000) {
          setIsLoading(false);
          setSnackbarProps(
            true,
            "error",
            "Oppsss, email already exist, try again"
          );
          return;
        }
        if (sendMany) {
          setIsLoading(false);
          setSnackbarProps(
            true,
            "info",
            "Request processed, see details below"
          );
          setManyResponse(res);
          return;
        }
        setIsLoading(false);
        setSnackbarProps(true, "success", "User added succesfully");
      });
  };

  const setSnackbarProps = (isOpen, alertSeverity, message) => {
    setIsSnackbarOpen(isOpen);
    setAlertSeverity(alertSeverity);
    setSnackbarMessage(message);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
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
        }}
      >
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={brands}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Brand" />}
          onChange={() => fetchSubscribers()}
        />

        <section
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={susbscribers}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              getRowId={(row) => row._id}
            />
          </div>
        </section>

        <section
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
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
              onClick={() => setIsModalOpen(true)}
            >
              Upload users
            </Button>
          </div>
        </section>
      </main>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Close
            style={{
              fontSize: 40,
              position: "absolute",
              right: 20,
              top: 20,
              cursor: "pointer",
            }}
            onClick={() => {
              setIsModalOpen(false);
              setIsLoading(true);
              fetchSubscribers();
            }}
          />

          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add users
          </Typography>

          <Divider> Add one user info </Divider>
          <div
            style={{
              border: "0.5px solid blue",
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: 10,
              marginBottom: 10,
            }}
          >
            <TextField
              error={email === "" ? true : false}
              id="email"
              label="Email"
              onChange={(e) => setEmail(e.target.value)}
              style={{ height: "100%", width: "70%" }}
            />
            <TextField
              error={fullName === "" ? true : false}
              id="fullname"
              label="Full name"
              onChange={(e) => setFullName(e.target.value)}
              style={{ height: "100%", width: "70%" }}
            />

            <Button
              style={{ width: 150, height: 40 }}
              variant="contained"
              component="label"
              onClick={() => sendData()}
            >
              {" "}
              Add{" "}
            </Button>
          </div>
          <Divider> Load txt or csv file </Divider>
          <Button
            style={{
              width: 150,
              height: 40,
              marginBottom: 20,
              alignSelf: "center",
            }}
            variant="contained"
            component="label"
          >
            {" "}
            Coming soon{" "}
          </Button>
          <Divider>
            {
              "Paste your info below ( Please paste a list of email separated by comma )"
            }
          </Divider>
          <TextareaAutosize
            aria-label="empty textarea"
            placeholder="user1@company1.com, user2@company2.com, user3@company3.com"
            style={{ width: "100%", height: 70 }}
            onChange={(e) => setUsersArray(e.target.value)}
          />
          <Button
            style={{
              width: 150,
              height: 40,
              marginBottom: 20,
              alignSelf: "center",
            }}
            variant="contained"
            component="label"
            onClick={() => sendData(true)}
          >
            Add many
          </Button>
          {manyResponse && (
            <pre style={{ fontSize: 12, height: 100, overflow: "auto" }}>
              {" "}
              {JSON.stringify(manyResponse, null, 2)}{" "}
            </pre>
          )}
        </Box>
      </Modal>

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
