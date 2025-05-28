// src/components/Watchlist/CryptoList.jsx
import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import axios from "axios";

const CryptoList = () => {
  const [cryptos, setCryptos] = useState([]);

  // Fetch top 100 cryptos
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1"
      );
      setCryptos(response.data);
    };
    fetchData();
  }, []);

  // Add to watchlist
  const addToWatchlist = async (cryptoId) => {
    const user = auth.currentUser;
    if (!user) return alert("Please login first!");

    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      const existingList = docSnap.exists() ? docSnap.data().watchlist : [];
      
      if (!existingList.includes(cryptoId)) {
        await setDoc(userRef, {
          watchlist: [...existingList, cryptoId],
        });
        alert("Added to watchlist!");
      } else {
        alert("Already in watchlist!");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Crypto</th>
          <th>Price (USD)</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {cryptos.map((crypto) => (
          <tr key={crypto.id}>
            <td>{crypto.market_cap_rank}</td>
            <td>
              <img src={crypto.image} alt={crypto.name} width="30" />{" "}
              {crypto.name}
            </td>
            <td>${crypto.current_price.toLocaleString()}</td>
            <td>
              <Button onClick={() => addToWatchlist(crypto.id)}>
                Add to Watchlist
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CryptoList;