import Signup from "./components/auth/Signup";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Character from "./components/Character";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import UpdateProfile from "./components/auth/UpdateProfile";
import React from "react";
import PrivateRoute from "./components/auth/PrivateRoute";
import Profession from "./components/Profession";
import { DataProvider } from "./contexts/DataContext";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Switch>
            <div>
              <div className="d-flex align-items-center justify-content-center">
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
              </div>
              <DataProvider>
                <PrivateRoute exact path="/" component={Character} />
                <PrivateRoute exact path="/profession" component={Profession} />
              </DataProvider>
            </div>
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
