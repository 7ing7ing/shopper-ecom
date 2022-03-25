import { Header, Footer } from "./components";

import {
  Home,
  Naruto,
  OnePiece,
  Kimetsu,
  Titans,
  Signin,
  Signup,
  Wishlist,
  Cart,
  Checkout,
  Orders,
  NotFound,
} from "./pages";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useAuthListener from "./hooks/use-auth-listener";
import ScrollToTop from "./hooks/scroll-to-top";
import { IfUserRedirect, ProtectedRoute } from "./helpers/routes";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK_TEST_KEY);

function App() {
  const { user } = useAuthListener();

  return (
    <Router>
      <ScrollToTop>
        <Header user={user} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/naruto" element={<Naruto user={user} />} />
          <Route path="/onepiece" element={<OnePiece user={user} />} />
          <Route path="/demonslayer" element={<Kimetsu user={user} />} />
          <Route path="/titans" element={<Titans user={user} />} />
          <Route
            path="/signin"
            element={
              <IfUserRedirect user={user} signedInPath="/" path="/signin">
                <Signin />
              </IfUserRedirect>
            }
          />
          <Route path="/signup" element={<Signup user={user} />} />
          <Route path="/wishlist" element={<Wishlist user={user} />} />
          <Route path="/cart" element={<Cart user={user} />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute
                user={user}
                signedInPath="/signin"
                path="/checkout"
              >
                <Elements stripe={stripePromise}>
                  <Checkout user={user} />
                </Elements>
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute user={user} signedInPath="/signin">
                <Orders user={user} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </ScrollToTop>
    </Router>
  );
}

export default App;
