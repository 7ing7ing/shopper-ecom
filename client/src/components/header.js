import "../styles/index.css";
import {
  Navbar,
  Container,
  Nav,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useContext, useEffect } from "react";
import { FirebaseContext } from "../context/firebase";
import { Link } from "react-router-dom";
import { useStateValue } from "../reducer/StateProvider";

export default function Header({ user }) {
  const { firebase } = useContext(FirebaseContext);
  const [{ cart, wishlist }, dispatch] = useStateValue();

  useEffect(() => {
    //Using localStorage to make the state persistent, otherwise, is lost on refresh. Each dispatch in the reducer will modify the localStorage at the same time state is modified.
    var localStorageWishlist = localStorage.getItem("wishlist");
    if (localStorageWishlist) {
      JSON.parse(localStorageWishlist).map((figure) => {
        dispatch({
          type: "ADD_TO_WISHLIST",
          item: figure,
        });
      });
    }

    var localStorageCart = localStorage.getItem("cart");
    if (localStorageCart) {
      JSON.parse(localStorageCart).map((figure) => {
        dispatch({
          type: "ADD_TO_CART",
          item: figure,
        });
      });
    }
  }, []);

  const handleSignout = () => {
    firebase.auth().signOut();
    dispatch({
      type: "EMPTY_CART",
    });
    dispatch({
      type: "EMPTY_WISHLIST",
    });
  };

  return (
    <Navbar className="bg-white" expand="lg">
      <Container fluid className="mx-0 lg-mx-5">
        <Link to="/">
          <Navbar.Brand>
            <img src="/images/logo.jpg" alt="" style={{ width: "200px" }} />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Form className="d-flex flex-grow-1">
            <FormControl
              type="search"
              placeholder="Search products here"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="default" className="btn btnTextColor btnBgColor">
              Search
            </Button>
          </Form>
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Link
              to={!user ? "/signin" : "#"}
              className="d-flex flex-column  text-center lg-align-items-center iconTextColor py-0 px-2 textDecoration"
            >
              <i
                className="bi bi-person-circle d-none d-lg-block"
                style={{ fontSize: "20px" }}
              ></i>

              <p className="pt-0 mb-0">
                {user ? `Hi, ${user?.displayName}!` : "Signin"}
              </p>
            </Link>

            <Link
              to="/wishlist"
              className="d-flex flex-column   text-center lg-align-items-center iconTextColor py-0 px-2 textDecoration"
            >
              <i
                className="bi bi-heart d-none d-lg-block"
                style={{ fontSize: "20px" }}
              ></i>
              <p className="pt-0 mb-0">
                {wishlist.length > 0
                  ? `Wishlist(${wishlist.length})`
                  : "Wishlist"}
              </p>
            </Link>
            <Link
              to="/cart"
              className="d-flex flex-column text-center lg-align-items-center iconTextColor py-0 px-2 textDecoration"
            >
              <i
                className="bi bi-basket3 d-none d-lg-block"
                style={{ fontSize: "20px" }}
              ></i>
              <p className="pt-0 mb-0">
                {cart.length > 0 ? `Cart(${cart.length})` : "Cart"}
              </p>
            </Link>
            {user ? (
              <Link
                to="/orders"
                className="d-flex flex-column text-center lg-align-items-center iconTextColor py-0 px-2 textDecoration"
              >
                <i
                  className="bi bi-receipt d-none d-lg-block"
                  style={{ fontSize: "20px" }}
                ></i>
                <p className="pt-0 mb-0">Orders</p>
              </Link>
            ) : (
              ""
            )}

            {user ? (
              <Link
                to="/"
                className="d-flex flex-column   text-center lg-align-items-center iconTextColor py-0 px-2 textDecoration"
                onClick={handleSignout}
              >
                <i
                  className="bi bi-box-arrow-right d-none d-lg-block"
                  style={{ fontSize: "20px" }}
                ></i>

                <p className="pt-0 mb-0">Signout</p>
              </Link>
            ) : (
              ""
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
