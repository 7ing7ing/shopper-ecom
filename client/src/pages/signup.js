import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../context/firebase";
import { Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const { firebase } = useContext(FirebaseContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isInvalid = username === "" || password === "" || email === "";

  const handleSignup = async (event) => {
    event.preventDefault();

    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        result.user.updateProfile({
          displayName: username,
        });
        firebase
          .firestore()
          .collection("users")
          //By giving the doc id the same id as the user uid, it's easier to access each user's documents later on (for orders, wishlist, cart).
          .doc(result.user.uid)
          .set({
            username: username,
            emailAddress: email,
            wishlist: [],
            cart: [],
          })
          .then(() => {
            navigate("/");
            //onAuthStateChanged will fire as soon as createUserWithEmailAndPassword finishes, so the user won't have their displayName set at that point. This will refresh and display the displayName.
            window.location.reload();
          })
          .catch((error) => {
            setUsername("");
            setEmail("");
            setPassword("");
            setError(error.message);
          });
      });
  };

  return (
    <div className="text-center bgBeige h-600">
      <div className="signContainer">
        <form className="form-sign d-flex flex-column justify-content-center align-items-center m-auto">
          <img
            className="mb-4 signLogo"
            src="/images/logohat.png"
            alt="logo"
            width="72"
            height="72"
          />

          <h1 className="h3 mb-3 font-weight-normal">Sign up now</h1>

          {error && <span className="red">{error}</span>}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email address"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />

          <input
            type="password"
            className="form-control mb-4"
            placeholder="Password"
            autoComplete="on"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />

          <button
            className="btn btn-lg btnTextColor btnBgColor btn-block mb-4 w-100"
            type="submit"
            disabled={isInvalid}
            onClick={handleSignup}
          >
            Sign up
          </button>
          <span>
            Already have an account?{" "}
            <Link to="/signin" className="textDecoration">
              Sign in now.
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}
