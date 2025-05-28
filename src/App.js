// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import MyWatchlist from "./components/Watchlist/MyWatchlist";
import Navbar from "./components/Common/Navbar"; // Create a simple Navbar
import Donate from "./components/Payment/Donate";

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* Add a navbar for navigation */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<MyWatchlist />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/" element={<Login />} /> {/* Default route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;