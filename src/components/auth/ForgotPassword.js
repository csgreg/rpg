import React, { useRef, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ForgotPassword() {
  const emailRef = useRef();

  const { resetPassword } = useAuth();

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions!");
    } catch (e) {
      console.log(e);
      setError("Failed to reset password!");
    }
    setLoading(false);
  }

  return (
    <div style={{ marginTop: "20vh" }} className="login">
      <Card id="resetpwcard" className="m-2">
        <Card.Body>
          <h2 className="text-center mb-4">Password Reset</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2" id="email">
              <Form.Label>Email</Form.Label>

              <Form.Control
                style={{ background: "transparent" }}
                placeholder="example@example.com"
                type="email"
                ref={emailRef}
                required
              ></Form.Control>
            </Form.Group>

            <Button
              id="resetbtn"
              disabled={loading}
              className="w-100 mt-3"
              type="submit"
            >
              Reset Password
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link className="loginlink" to="/login">
              Log in
            </Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account?{" "}
        <Link className="loginlink" to="/signup">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
