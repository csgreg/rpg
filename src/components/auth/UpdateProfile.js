import React, { useRef, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordlRef = useRef();
  const passwordConfirmRef = useRef();
  const history = useHistory();

  const { currentUser, updateEmail, updatePassword } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordlRef.current.value !== passwordConfirmRef.current.value) {
      setError("Passwords do not match!");
      return;
    }

    const promises = [];
    setLoading(true);
    setError("");
    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }
    if (passwordlRef.current.value) {
      promises.push(updatePassword(passwordlRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        history.push("/");
      })
      .catch(() => {
        setError("Failed to update account!");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <Card className="m-2">
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2" id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                required
                defaultValue={currentUser.email}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-2" id="password">
              <Form.Label>Passwrod</Form.Label>
              <Form.Control
                type="password"
                ref={passwordlRef}
                placeholder="Leave blank to keep the same!"
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-4" id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmRef}
                placeholder="Leave blank to keep the same!"
              ></Form.Control>
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
      </div>
    </>
  );
}
