var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "cjsssmhpc5v2gdkm",
  publicKey: "4t586tfv2rnvb58n",
  privateKey: "dabc4782051777a43b32d9913d71a170"
});


exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, function (err, response) {
        if(err) {
            res.status(500).send(err);
        }else {
            res.send(response)
        }
      });
}

exports.processPayment =(req, res) => {

    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount

    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
          if(err) {
              res.status(500).send(err);
          }else {
              res.json(result);
          }
       });
}