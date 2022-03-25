import { Container, Row, Col, Button } from "react-bootstrap";
import { useStateValue } from "../reducer/StateProvider";
import CurrencyFormat from "react-currency-format";
import { getCartTotal } from "../reducer/reducer";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useContext, useState } from "react";
import { FirebaseContext } from "../context/firebase";

export default function Checkout({ user }) {
  const { firebase } = useContext(FirebaseContext);
  const [{ cart }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    fetch("/checkout/secret?price=" + getCartTotal(cart).toFixed(2) * 100)
      .then(function (response) {
        return response.json();
      })
      .then(function (responseJson) {
        const clientSecret = responseJson.client_secret;
        stripe
          .confirmCardPayment(clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement),
            },
          })
          .then(({ paymentIntent }) => {
            firebase
              .firestore()
              .collection("users")
              .doc(user?.uid)
              .collection("orders")
              .doc(paymentIntent.id)
              .set({
                cart: cart,
                amount: paymentIntent.amount,
                created: paymentIntent.created,
              });
            setProcessing(false);

            dispatch({
              type: "EMPTY_CART",
            });

            navigate("/orders");
          });
      });
  };

  const handleChange = (event) => {
    setDisabled(!event.complete);
    setError(event.error ? event.error.message : "");
  };

  const removeFromCart = (id) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      id: id,
    });
  };

  return (
    <Container fluid className="vh-100 px-4">
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
                    alt="..."
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
          <div className="checkoutBox px-3 pb-3 mb-3">
            <h3 className="mt-3">Delivery adddress</h3>
            <span>{user.displayName}</span>
            <br />
            <span>Gumdrop House, Lollipop Lane</span>
            <br />
            <span>Happy-Land</span>
          </div>
          <div className="checkoutBox px-3">
            <h3 className="mt-3">Payment</h3>
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
              <form onSubmit={handleSubmit}>
                {error && <p className="red">{error}</p>}
                <CardElement onChange={handleChange} />

                <button
                  disabled={disabled}
                  className="btn btn-lg btnTextColor btnBgColor btn-block my-4 w-100"
                  type="submit"
                >
                  {processing ? "Processing..." : "Buy now"}
                </button>
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
