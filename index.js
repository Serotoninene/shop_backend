require('dotenv').config()
const cors = require("cors");
const express = require("express");

const PORT = process.env.PORT || 8080; // use either the host env var port (PORT) provided by Heroku or the local port (5000) on your machine
const stripeKey = process.env.STRIPE_SECRET_KEY
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const {
  v4: uuidv4
} = require("uuid");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.send("Hello")
})

app.post("/payment", (req, res) => {
  const {
    product,
    token
  } = req.body;
  const idempotencyKey = uuidv4()
  return stripe.customers.create({
    email: token.email,
    source: token.id
  }).then(customer => {
    stripe.charges.create({
        amount: product.price * 100,
        currency: "eur",
        customer: customer.id,
        receipt_email: token.email,
        description: `purchase of ${product.name}`,
        shipping: {
          name: token.card.name,
          phone: token.card.phone,
          address: {
            country: token.card.address_country,
            postAddress: token.card.address,
            zipCode: token.card.zipCode
          }
        }
      }, {
        idempotencyKey
      })
      .then(result = res.status(202).json(result))
      .catch(err => console.log(err))
  })
});

// listen
app.listen(PORT, () => {
  console.log(PORT)
})