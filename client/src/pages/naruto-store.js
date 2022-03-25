import { Card, Row, Col, Button } from "react-bootstrap";
import "../styles/index.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { naruto } from "../utils/naruto";
import { useStateValue } from "../reducer/StateProvider";
import { useState, useContext } from "react";
import { FirebaseContext } from "../context/firebase";
import { arrayUnion } from "firebase/firestore";

export default function Naruto({ user }) {
  const { firebase } = useContext(FirebaseContext);
  const [{ cart, wishlist }, dispatch] = useStateValue();
  const [key, setKey] = useState("");
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState("");
  const [price, setPrice] = useState("");

  const addToWishlist = ({
    key,
    id,
    series,
    title,
    description,
    img,
    price,
  }) => {
    // Find the index of the figure in the series array (1 of the 4 series in the utils folder) by matching the id. Then, use this index to change "liked" to false or true (this would change the colour of the like heart in each figure store). This approach is used again below, when removing item from the wishlist.
    let itemIndex = naruto.findIndex((item) => item.id === id);
    naruto[itemIndex].liked = true;

    setKey(key);
    setId(id);
    setTitle(title);
    setDescription(description);
    setImg(img);
    setPrice(price);
    dispatch({
      type: "ADD_TO_WISHLIST",
      item: {
        key,
        id,
        series,
        title,
        description,
        img,
        price,
      },
    });

    if (user) {
      // If there is a user (user is logged in), update the database accordingly. This approach is used below, again, with removeFromWishlist and addToCart.
      firebase
        .firestore()
        .collection("users")
        .doc(user?.uid)
        .update({
          wishlist: arrayUnion({
            key,
            id,
            series,
            title,
            description,
            img,
            price,
          }),
        });
    }
  };

  const removeFromWishlist = (id) => {
    let itemIndex = naruto.findIndex((item) => item.id === id);
    naruto[itemIndex].liked = false;
    dispatch({
      type: "REMOVE_FROM_WISHLIST",
      id: id,
    });

    if (user) {
      let newWishlist = [];
      let dbUser = firebase.firestore().collection("users").doc(user?.uid);
      dbUser.get().then((result) => {
        let userData = result.data();
        newWishlist = [...userData.wishlist];

        let index = newWishlist.findIndex((item) => item.id === id);
        newWishlist.splice(index, 1);

        firebase
          .firestore()
          .collection("users")
          .doc(user?.uid)
          .update({
            wishlist: [...newWishlist],
          });
      });
    }
  };

  const addToCart = ({ key, id, title, description, img, price }) => {
    setKey(key);
    setId(id);
    setTitle(title);
    setDescription(description);
    setImg(img);
    setPrice(price);
    dispatch({
      type: "ADD_TO_CART",
      item: {
        key,
        id,
        title,
        description,
        img,
        price,
      },
    });

    if (user) {
      firebase
        .firestore()
        .collection("users")
        .doc(user?.uid)
        .update({
          cart: arrayUnion({
            key,
            id,
            title,
            description,
            img,
            price,
          }),
        });
    }
  };
  return (
    <div>
      <img className="d-block w-100" src="images/naruto.jpg" alt="naruto" />
      <h1 className="text-center p-3">NARUTO</h1>
      <div className="marginContainer">
        <Row xs={1} md={2} lg={3} className="g-4 d-flex justify-content-center">
          {naruto.map((figure) => (
            <Col key={figure.key} id={figure.id}>
              <div className="d-flex justify-content-center align-items-center">
                <Card style={{ width: "25rem" }}>
                  <Card.Img
                    variant="top"
                    src={figure.img}
                    alt={`${figure.title} image`}
                  />
                  <Card.Body>
                    <Card.Title>{figure.title}</Card.Title>
                    <Card.Text>{figure.description}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>£{figure.price}</span>
                      <div className="d-flex">
                        <i
                          className={`bi bi-heart cursorPointer ${
                            figure.liked ? "red" : "black"
                          }`}
                          style={{ fontSize: "25px", marginRight: "20px" }}
                          onClick={
                            figure.liked
                              ? () => {
                                  removeFromWishlist(figure.id);
                                }
                              : () => {
                                  addToWishlist(
                                    {
                                      key: figure.key,
                                      id: figure.id,
                                      series: figure.series,
                                      title: figure.title,
                                      description: figure.description,
                                      img: figure.img,
                                      price: figure.price,
                                    },
                                    naruto
                                  );
                                }
                          }
                        ></i>
                        <Button
                          variant="default"
                          className="btnBgColor btnTextColor"
                          onClick={() => {
                            addToCart({
                              key: figure.key,
                              id: figure.id,
                              title: figure.title,
                              description: figure.description,
                              img: figure.img,
                              price: figure.price,
                            });
                          }}
                        >
                          Add to cart
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
