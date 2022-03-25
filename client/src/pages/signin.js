import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FirebaseContext } from "../context/firebase";
import { Link } from "react-router-dom";
import { naruto } from "../utils/naruto";
import { kimetsu } from "../utils/kimetsu";
import { onepiece } from "../utils/onepiece";
import { titans } from "../utils/titans";
import { useStateValue } from "../reducer/StateProvider";

export default function Signin() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { firebase } = useContext(FirebaseContext);
  const [email, setEmail] = useState("tingtingchen@gmail.com");
  const [password, setPassword] = useState("qwert12345");
  const [error, setError] = useState("");
  const [{ wishlist }, dispatch] = useStateValue();
  const isInvalid = password === "" || email === "";
  const handleSignin = (event) => {
    event.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)

      .then((result) => {
        //Empty wishlist
        wishlist.map((item) => {
          let series = [];
          switch (item.series) {
            case "naruto":
              series = naruto;
              break;
            case "kimetsu":
              series = kimetsu;
              break;
            case "onepiece":
              series = onepiece;
              break;
            case "titans":
              series = titans;
              break;
            default:
              return null;
          }
          let itemIndex = series.findIndex((figure) => item.id === figure.id);
          series[itemIndex].liked = false;
          dispatch({
            type: "REMOVE_FROM_WISHLIST",
            id: item.id,
          });
        });

        //Getting the database wishlist and saving it in a variable
        let user = result.user.uid;
        if (user) {
          let dbUser = firebase.firestore().collection("users").doc(user);
          dbUser.get().then((result) => {
            let dbWishlist = result.data().wishlist;
            dbWishlist.map((figure) => {
              let series = [];
              switch (figure.series) {
                case "naruto":
                  series = naruto;
                  break;
                case "kimetsu":
                  series = kimetsu;
                  break;
                case "onepiece":
                  series = onepiece;
                  break;
                case "titans":
                  series = titans;
                  break;
                default:
                  return null;
              }
              //Match the id and with it, find it´s index in the oen of the four series to change the "liked" key accordingly.

              let itemIndex = series.findIndex((item) => item.id === figure.id);
              series[itemIndex].liked = true;
              //Update state
              dispatch({
                type: "ADD_TO_WISHLIST",
                item: {
                  key: figure.key,
                  id: figure.id,
                  series: figure.series,
                  title: figure.title,
                  description: figure.description,
                  img: figure.img,
                  price: figure.price,
                },
              });
            });
          });
        }

        if (
          //When a user is redirected to sign in, once logged in, take the user to the previous path (checkout and orders are protectec).
          state &&
          (state.previousPath === "/checkout" ||
            state.previousPath === "/orders")
        ) {
          navigate(-1, { replace: true });
        } else {
          navigate("/");
        }
      })

      .catch((error) => {
        setEmail("");
        setPassword("");
        setError(error.message);
      });
  };

  return (
    <div className="text-center bgBeige h-600">
      <div className="signContainer">
        <form className="form-sign d-flex flex-column justify-content-center align-items-center m-auto">
          <img
            className="mb-4 signLogo"
            src="/images/logohat.png"
            alt=""
            width="72"
            height="72"
          />
          <h1 className="h3 mb-3 font-weight-normal">Sign in now</h1>
          {error && <span className="red">{error}</span>}
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email address"
            defaultValue={email}
            onChange={({ target }) => setEmail(target.value)}
          />

          <input
            type="password"
            className="form-control mb-4"
            placeholder="Password"
            defaultValue={password}
            onChange={({ target }) => setPassword(target.value)}
            autoComplete="on"
          />

          <button
            className="btn btn-lg btnTextColor btnBgColor btn-block mb-4 w-100"
            type="submit"
            disabled={isInvalid}
            onClick={handleSignin}
          >
            Sign in
          </button>
          <span>
            Don't have an account?{" "}
            <Link to="/signup" className="textDecoration">
              Sign up now.
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}
