const User = require("../models/user");
const braintree = require("braintree");
require("dotenv").config();

// BRAINTREE_MERCHANT_ID = nrndq2qc76y6pbrc;
// BRAINTREE_PUBLIC_KEY = mv4qcfkk25yz86km;
// BRAINTREE_PRIVATE_KEY = ac6a7c08ac677c80aae75bb6fdf6f8d7;

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

exports.generateToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amountFromTheClient = req.body.amount;
  //charge
  let newTransaction = gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (error, result) => {
      if (error) {
        return res.status(500).json(error);
      } else {
        res.json(result);
      }
    }
  );
};
