import { Card, Row, Col, Button } from "react-bootstrap";
import { useState, useContext } from "react";
import { useStateValue } from "../reducer/StateProvider";
import { FirebaseContext } from "../context/firebase";
import { naruto } from "../utils/naruto";
import { kimetsu } from "../utils/kimetsu";
import { onepiece } from "../utils/onepiece";
import { titans } from "../utils/titans";
import { arrayUnion } from "firebase/firestore";

export default function Wishlist({ user }) {
  const { firebase } = useContext(FirebaseContext);
  const [{ wishlist }, dispatch] = useStateValue();
  const [key, setKey] = useState("");
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState("");
  const [price, setPrice] = useState("");

  const removeFromWishlist = (id, series) => {
    let itemsInSeries = [];
    switch (series) {
      case "naruto":
        itemsInSeries = naruto;
        break;
      case "kimetsu":
        itemsInSeries = kimetsu;
        break;
      case "onepiece":
        itemsInSeries = onepiece;
        break;
      case "titans":
        itemsInSeries = titans;
        break;
      default:
        return null;
    }
    let itemIndex = itemsInSeries.findIndex((item) => item.id === id);

    itemsInSeries[itemIndex].liked = false;

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
    <div className="px-4" style={{ minHeight: "700px" }}>
      <h2 className="mt-3 mb-5 my-md-5 text-center">Your wishlist</h2>
      <div>
        <div className="">
          <Row
            xs={1}
            md={2}
            lg={3}
            className="g-4 d-flex justify-content-center"
          >
            {wishlist.map((item) => (
              <Col key={item.key} id={item.id}>
                <div className="d-flex justify-content-center align-items-center">
                  <Card style={{ width: "25rem" }}>
                    <Card.Img
                      variant="top"
                      src={item.img}
                      alt={`${item.title} image`}
                    />
                    <Card.Body>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Text>{item.description}</Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>£{item.price}</span>
                        <div className="d-flex">
                          <Button
                            variant="default"
                            className="btnBgColor btnTextColor"
                            style={{ marginRight: "15px" }}
                            onClick={() => {
                              addToCart({
                                key: item.key,
                                id: item.id,
                                title: item.title,
                                description: item.description,
                                img: item.img,
                                price: item.price,
                              });
                            }}
                          >
                            Add to cart
                          </Button>
                          <Button
                            variant="default"
                            className="btnBgColor btnTextColor mr-3"
                            onClick={() => {
                              removeFromWishlist(item.id, item.series);
                            }}
                          >
                            Remove
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
    </div>
  );
}
