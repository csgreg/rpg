import { Container } from "react-bootstrap";
import Signup from "./components/auth/Signup";
import { AuthProvider } from "./contexts/AuthContext";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Character from "./components/Character";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import UpdateProfile from "./components/auth/UpdateProfile";
import React, { useEffect, useState } from "react";
import db from "./firebase";
import { collection, onSnapshot } from "@firebase/firestore";
import PrivateRoute from "./components/auth/PrivateRoute";
import Profession from "./components/Profession";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={Character} />
            <PrivateRoute exact path="/profession" component={Profession} />
            <Container
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "100vh" }}
            >
              <div className="w-100" style={{ maxWidth: "400px" }}>
                <PrivateRoute
                  path="/update-profile"
                  component={UpdateProfile}
                />
                <Route path="/signup" component={Signup} />
                <Route
                  className="d-flex align-items-center justify-content-center"
                  style={{ minHeight: "100vh" }}
                  path="/login"
                  component={Login}
                />
                <Route path="/forgot-password" component={ForgotPassword} />
              </div>
            </Container>
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
