import { Link } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { getAuth, signOut } from "firebase/auth";

const CustomNavbar = () => {
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      alert("Logout error: " + err.message);
    }
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">
          CryptoWatch Pro
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/dashboard">
            Watchlist
          </Nav.Link>
          <Nav.Link as={Link} to="/donate">
            Donate
          </Nav.Link>
        </Nav>
        <Button onClick={handleLogout} variant="outline-light">
          Logout
        </Button>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;