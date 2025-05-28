// src/components/Watchlist/CryptoList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, Spinner } from "react-bootstrap";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import CryptoChart from "./CryptoChart";

const CryptoList = () => {
  const [cryptos, setCryptos] = useState([]);
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("market_cap_rank");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 100,
              page: 1,
              sparkline: false,
              price_change_percentage: "1h,24h,7d",
            },
          }
        );
        setCryptos(response.data);
        setFilteredCryptos(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cryptos:", error);
        setLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  useEffect(() => {
    let filtered = cryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortKey === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortOrder === "asc"
          ? a[sortKey] - b[sortKey]
          : b[sortKey] - a[sortKey];
      }
    });

    setFilteredCryptos(filtered);
  }, [searchTerm, sortKey, sortOrder, cryptos]);

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
    <div className="p-4">
      <h3>All Cryptocurrencies</h3>
      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name or symbol"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>
      <div className="mb-3 d-flex gap-2">
        <Form.Select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="market_cap_rank">Rank</option>
          <option value="current_price">Price</option>
          <option value="price_change_percentage_24h">24h Change %</option>
        </Form.Select>
        <Form.Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </Form.Select>
      </div>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Crypto</th>
              <th>Price (USD)</th>
              <th>24h Change</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCryptos.map((crypto) => (
              <React.Fragment key={crypto.id}>
                <tr>
                  <td>{crypto.market_cap_rank}</td>
                  <td>
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      width="30"
                      className="me-2"
                    />
                    {crypto.name} ({crypto.symbol.toUpperCase()})
                  </td>
                  <td>${crypto.current_price.toLocaleString()}</td>
                  <td
                    style={{
                      color:
                        crypto.price_change_percentage_24h >= 0
                          ? "green"
                          : "red",
                    }}
                  >
                    {crypto.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      onClick={() => addToWatchlist(crypto.id)}
                    >
                      Add to Watchlist
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td colSpan={5}>
                    <CryptoChart cryptoId={crypto.id} />
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default CryptoList;
