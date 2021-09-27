import React, { useRef, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Signup() {
  const emailRef = useRef();
  const passwordlRef = useRef();
  const passwordConfirmRef = useRef();
  const history = useHistory();

  const { signup } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordlRef.current.value !== passwordConfirmRef.current.value) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordlRef.current.value);
      history.push("/");
    } catch (e) {
      console.log(e);
      setError("Failed to create an account!");
    }
    setLoading(false);
  }

  return (
    <>
      <Card className="m-2">
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
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

            <Form.Group className="mb-4" id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmRef}
                required
              ></Form.Control>
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </>
  );
}
