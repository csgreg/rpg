import { collection, onSnapshot, query, where } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import db from "../../firebase";

export default function AllAuctions() {
  const [initializing, setInitializing] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const { getMaterialById } = useData();
  const { currentUser } = useAuth();

  useEffect(
    async () =>
      await onSnapshot(
        query(collection(db, "marketplace"), where("status", "==", "active")),
        (snapshot) => {
          setAuctions(
            snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          );
        }
      ),
    []
  );

  return (
    <div>
      {initializing && <div>Loading....</div>}
      {!initializing && (
        <Card className="m-4 w-50">
          <Card.Header>All auctions</Card.Header>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Material</th>
                <th>Quantity</th>
                <th>Gold</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {auctions.map((a) => (
                <tr>
                  <td>{a.id}</td>
                  <td>{getMaterialById(a.material)}</td>
                  <td>{a.quantity}</td>
                  <td>{a.gold}</td>
                  <td>
                    <Button>Buy</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </div>
  );
}
