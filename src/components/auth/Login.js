import React, { useRef, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import db from "../../firebase";

export default function Login() {
  const emailRef = useRef();
  const passwordlRef = useRef();
  const history = useHistory();

  const { login, currentUser } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      await login(emailRef.current.value, passwordlRef.current.value);
      history.push("/");
    } catch (e) {
      console.log(e);
      setError("Failed to log in!");
    }
    setLoading(false);
  }

  return (
    <>
      <Card className="m-2">
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2" id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required></Form.Control>
            </Form.Group>

            <Form.Group className="mb-2" id="password">
              <Form.Label>Passwrod</Form.Label>
              <Form.Control
                type="password"
                ref={passwordlRef}
                required
              ></Form.Control>
            </Form.Group>

            <Button disabled={loading} className="w-100 mt-3" type="submit">
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  );
}
