const { v4: uuid4 } = require('uuid');
const stripeInitializer = require("stripe");

const db = require('./firebase-init.js')

const { getEndPoint, firestoreDocument, firestoreCollection, firebaseDocumentFromRef, firebaseCollectionFromRef } = require('./helper.js')


module.exports = (app, isDebug = false) => {

  app.post('/donation', async (req, res) => {

  console.log(req.method)

  const { amount, currencyCode, uidCoach, uidClient, classID, duration, className, coachName, coachLastName } = req.body;

  console.log(currencyCode)
  console.log(typeof currencyCode)
  //const stripe = stripeInitializer("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");
  const stripe = stripeInitializer("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");
 
  console.log("inside backend")
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: currencyCode,
          product_data: {
            name: 'Urban Studio',
          },
          unit_amount: amount,
        },
        quantity: 1,
         
      },

    ],
    mode: 'payment',
    success_url: 'http://localhost:3000/payment-success/class-listing/' + uidCoach + "/" +  amount + "/" +  classID + "/" + currencyCode,
    cancel_url: 'https://app.urban.studio',
  });

  console.log(session)

  res.json({ id: session.id });
});

}