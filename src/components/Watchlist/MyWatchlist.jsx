// src/components/Watchlist/MyWatchlist.jsx
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { auth, db } from "../../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import axios from "axios";
import CryptoChart from "./CryptoChart";

const MyWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [cryptoPrices, setCryptoPrices] = useState({});

  // Fetch user's watchlist
  useEffect(() => {
    const fetchWatchlist = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setWatchlist(docSnap.data().watchlist);
      }
    };
    fetchWatchlist();
  }, []);

  // Fetch real-time prices every 60 seconds
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" +
            watchlist.join(",")
        );
        const prices = {};
        response.data.forEach((crypto) => {
          prices[crypto.id] = crypto.current_price;
        });
        setCryptoPrices(prices);
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    if (watchlist.length > 0) {
      const interval = setInterval(fetchPrices, 60000);
      fetchPrices(); // Initial fetch
      return () => clearInterval(interval);
    }
  }, [watchlist]);

  return (
    <div className="p-4">
      <h3>Your Watchlist</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Crypto</th>
            <th>Price (USD)</th>
          </tr>
        </thead>
        <tbody>
          {watchlist.map((cryptoId) => (
            <React.Fragment key={cryptoId}>
              <tr>
                <td>{cryptoId.toUpperCase()}</td>
                <td>
                  ${cryptoPrices[cryptoId]?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || "Loading..."}
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <CryptoChart cryptoId={cryptoId} />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default MyWatchlist;