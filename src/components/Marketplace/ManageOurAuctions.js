import { collection, onSnapshot, query, where } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import db from "../../firebase";

export default function ManageOurAuctions({ character }) {
  const [initializing, setInitializing] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const { getMaterialById, updateAuction, updateCharacter } = useData();
  const { characterId } = useAuth();

  async function handleAuctionCancel(auction) {
    auction.status = "cancelled";
    if (character.materials[auction.material]) {
      character.materials[auction.material] += parseInt(auction.quantity);
    } else {
      character.materials[auction.material] = parseInt(auction.quantity);
    }
    await updateAuction(auction);
    await updateCharacter(character);
  }

  async function handleGetGold(auction) {
    character.gold += parseInt(auction.gold);
    auction.status = "done";
    await updateAuction(auction);
    await updateCharacter(character);
  }

  useEffect(
    async () =>
      await onSnapshot(
        query(
          collection(db, "marketplace"),
          where("status", "in", ["active", "sold"]),
          where("seller", "==", characterId)
        ),
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
      <div>
        {initializing && <div>Loading....</div>}
        {!initializing && (
          <Card className="auctiontable m-4 w-90">
            <Card.Header>My auctions</Card.Header>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Quantity</th>
                  <th>Gold</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {auctions.map((a) => (
                  <tr>
                    <td>{getMaterialById(a.material)}</td>
                    <td>{a.quantity}</td>
                    <td>{a.gold}</td>
                    <td>
                      {a.status === "active" ? (
                        <Button onClick={() => handleAuctionCancel(a)}>
                          Cancel
                        </Button>
                      ) : (
                        <Button onClick={() => handleGetGold(a)}>Gimme</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  );
}
