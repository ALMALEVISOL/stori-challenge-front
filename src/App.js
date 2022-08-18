import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ResponsiveDrawer from "./components/ResponsiveDrawer";
import CssBaseline from "@mui/material/CssBaseline";
import { Mail } from "./components/Mail";
import { Subscriber } from "./components/Subscriber";
import { Unsubscribe } from "./components/Unsubscribe";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const drawerWidth = 240;

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const routes = [
    {
      path: "/send",
      title: "Send email",
      element: (
        <Mail
          label={"Send email"}
          setIsLoading={setIsLoading}
        />
      ),
    },
    {
      path: "/dashboard",
      title: "Dashboard",
      element: (
        <Mail
          label={"Send email"}
          setIsLoading={setIsLoading}
        />
      ),
    },
    {
      path: "/subscribers",
      title: "Subscribers",
      element: (
        <Subscriber
          label={"Subscriber"}
          setIsLoading={setIsLoading}
        />
      ),
    },
    {
      path: "/unsubscribe",
      title: "Good bye",
      element: (
        <Unsubscribe
          label={"Subscriber"}
          setIsLoading={setIsLoading}
        />
      ),
    },
  ];
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <CssBaseline />
        <Backdrop sx={{ color: "blue", zIndex: 99999 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <ResponsiveDrawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
          routes={routes}
        >
        </ResponsiveDrawer>
        <Routes>
          <Route exact path="/"></Route>
          {routes.map((item, idx) => {
            return <Route path={item.path} key={idx} element={item.element} />;
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
