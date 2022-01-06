const cors = require("cors");
const express = require("express");
// TODO add a stripe key require : 
const stripe = require("stripe")("sk_test_51HxBZ3IPBvrCL5GdlBs0GBBN1OI77D9iv1FrN86DCX8VfKyTGxdioJ5eUvFB0SzYHugwIEZLWNYVger5TGcLfPJg00gK1wrRis")
const {
  v4: uuidv4
} = require("uuid");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/payment", (req, res) => {
  const {
    product,
    token
  } = req.body;
  console.log("Product : ", product)
  console.log("Price : ", product.price)
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
app.listen(8282, () => {
  console.log("Listenning to port 8282")
})