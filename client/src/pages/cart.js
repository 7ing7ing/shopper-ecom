import { Container, Row, Col, Button } from "react-bootstrap";
import "../styles/index.css";
import { Link } from "react-router-dom";
import { useStateValue } from "../reducer/StateProvider";
import CurrencyFormat from "react-currency-format";
import { getCartTotal } from "../reducer/reducer";
import { FirebaseContext } from "../context/firebase";
import { useContext } from "react";

export default function Cart({ user }) {
  const { firebase } = useContext(FirebaseContext);
  const [{ cart }, dispatch] = useStateValue();

  const removeFromCart = (id) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      id: id,
    });

    if (user) {
      let newCart = [];
      let dbUser = firebase.firestore().collection("users").doc(user?.uid);
      dbUser.get().then((result) => {
        let userData = result.data();
        newCart = [...userData.cart];

        let index = newCart.findIndex((item) => item.id === id);
        newCart.splice(index, 1);

        firebase
          .firestore()
          .collection("users")
          .doc(user?.uid)
          .update({
            cart: [...newCart],
          });
      });
    }
  };

  return (
    <Container fluid className="px-4" style={{ minHeight: "700px" }}>
      <Row>
        <Col xs={12} md={8} className="mt-3">
          <div
            className="checkoutBox px-3 pb-3 mb-3"
            style={{ maxWidth: "750px" }}
          >
            <h3 className="mt-3">Shopping cart</h3>
          </div>
          {cart.map((item) => (
            <div
              className="card mb-3"
              style={{ maxWidth: "750px" }}
              key={item.key}
              id={item.id}
            >
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={item.img}
                    className="img-fluid rounded-start"
                    alt={item.title}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{item.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="mb-0">£{item.price}</p>
                      <Button
                        variant="default"
                        className="btnBgColor btnTextColor"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Col>
        <Col xs={12} md={4} className="mt-3">
          <div className="checkoutBox px-3">
            <h3 className="mt-3">Check out</h3>
            <div>
              <p>
                Subtotal ({cart.length} item(s)):
                <span>
                  {" "}
                  <CurrencyFormat
                    renderText={(value) => <span>{value}</span>}
                    decimalScale={2}
                    value={getCartTotal(cart)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"£"}
                  />
                </span>
              </p>
              <Link to="/checkout">
                <button
                  className="btn btn-lg btnTextColor btnBgColor btn-block my-4 w-100"
                  type="submit"
                >
                  Proceed to checkout
                </button>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
