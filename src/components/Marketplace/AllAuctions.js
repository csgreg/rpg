import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Table } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import db from "../../firebase";

export default function AllAuctions({ character }) {
  const [loadingInner, setLoading] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const { getMaterialById, updateAuction, updateCharacter, loading } =
    useData();
  const { currentUser, characterId } = useAuth();
  const [search, setSearch] = useState("");

  useEffect(async () => {
    await onSnapshot(
      query(collection(db, "marketplace"), where("status", "==", "active")),
      (snapshot) => {
        setAuctions(
          snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
      }
    );
  }, []);

  async function handleBuyAuction(auction) {
    setLoading(true);
    if (character.gold < auction.gold) {
      return;
    }
    character.gold -= parseFloat(auction.gold);
    if (character.materials[auction.material]) {
      character.materials[auction.material] += parseInt(auction.quantity);
    } else {
      character.materials[auction.material] = parseInt(auction.quantity);
    }
    auction.status = "sold";

    await updateAuction(auction);
    await updateCharacter(character);
    setLoading(false);
  }

  return (
    <div>
      <Card className="auctiontable m-4 w-90">
        <Card.Header>All auctions</Card.Header>
        <Table
          striped
          bordered
          hover
          cellspacing="0"
          cellpadding="1"
          border="1"
          width="300"
        >
          <thead>
            <tr>
              <th>Material</th>
              <th>Quantity</th>
              <th>Price</th>
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
                  <Button
                    onClick={() => handleBuyAuction(a)}
                    disabled={characterId === a.seller || loadingInner}
                  >
                    Buy
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
