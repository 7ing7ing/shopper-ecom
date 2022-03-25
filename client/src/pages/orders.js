import { useContext } from "react";
import { FirebaseContext } from "../context/firebase";
import { useState, useEffect } from "react";
import moment from "moment";
import "../styles/index.css";
export default function Orders({ user }) {
  const { firebase } = useContext(FirebaseContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      firebase
        .firestore()
        .collection("users")
        .doc(user?.uid)
        .collection("orders")
        .orderBy("created", "desc")
        .onSnapshot((orders) =>
          setOrders(
            orders.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          )
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div style={{ minHeight: "700px" }}>
      <h2 className="py-3 px-2 px-md-5 my-md-5 text-center">Your orders</h2>
      <div>
        <div>
          {orders?.map((order) => (
            <div
              className="mx-3 mx-md-5 px-3 px-md-5 py-3 py-md-5 mb-2 mb-md-5 bg-white border-order"
              key={order.id}
            >
              <div className="">
                <h5>Order</h5>
                <p>
                  {moment.unix(order.data.created).format("MMMM Do YYYY H:mm")}
                </p>
              </div>
              <div className="d-flex flex-column">
                {order.data.cart.map((item, index) => (
                  <div className="d-flex" key={index}>
                    <img
                      className="order-img"
                      src={item.img}
                      alt={item.title}
                      style={{ maxWidth: "250px" }}
                    />
                    <div className="order-text mb-2">
                      <span className="bold mb-0">{item.title}</span>
                      <br />
                      <span>{item.description}</span>
                      <br />
                      <span className="d-flex justify-content-end bold">
                        {" "}
                        £{item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <h5 className="d-flex justify-content-end">
                Order total: £{order.data.amount / 100}
              </h5>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
