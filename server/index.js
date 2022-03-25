const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SK_TEST_KEY);

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/checkout/secret", async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.query.price,
    currency: "gbp",
    payment_method_types: ["card"],
  });
  console.log(paymentIntent);
  res.json({ client_secret: paymentIntent.client_secret });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
