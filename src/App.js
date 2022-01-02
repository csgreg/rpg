import Signup from "./components/auth/Signup";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Character from "./components/Character";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import UpdateProfile from "./components/auth/UpdateProfile";
import React from "react";
import PrivateRoute from "./components/auth/PrivateRoute";
import { DataProvider, useData } from "./contexts/DataContext";
import Adventure from "./components/Adventure";
import Marketplace from "./components/Marketplace";
import Crafting from "./components/Crafting";
import { Container } from "react-bootstrap";
import GNavbar from "./components/Navbar";

function App() {
  return (
    <div
      style={{
        backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/rpggame-e41ae.appspot.com/o/Images%2Fha%CC%81tte%CC%81r.png?alt=media&token=955a5178-d17c-4a4c-bce0-b8a16d8c1979")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Router>
        <AuthProvider>
          <Switch>
            <div style={{ minHeight: "100vh" }}>
              <DataProvider>
                <PrivateRoute path="/" component={GNavbar} />
                <PrivateRoute exact path="/" component={Character} />
                <PrivateRoute exact path="/crafting" component={Crafting} />
                <PrivateRoute exact path="/adventure" component={Adventure} />
                <PrivateRoute
                  exact
                  path="/marketplace"
                  component={Marketplace}
                />
              </DataProvider>
              <div className="d-flex align-items-center justify-content-center vertical-center">
                <div className="w-100" style={{ maxWidth: "400px" }}>
                  <PrivateRoute
                    path="/update-profile"
                    component={UpdateProfile}
                  />

                  <Route path="/signup" component={Signup} />
                  <Route path="/login" component={Login} />
                  <Route path="/forgot-password" component={ForgotPassword} />
                </div>
              </div>
            </div>
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
