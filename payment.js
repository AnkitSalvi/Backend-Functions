const { v4: uuid4 } = require('uuid');
const stripeInitializer = require("stripe");

const db = require('./firebase-init.js')

const { getEndPoint, firestoreDocument, firestoreCollection, firebaseDocumentFromRef, firebaseCollectionFromRef } = require('./helper.js')


module.exports = (app, isDebug = false) => {

  // app.post(getEndPoint("/payment", isDebug), async (req, res) => {

  //   const stripe = stripeInitializer(isDebug ? "sk_test_ZLn2Zl9F4yOlCABQ9OdjwuA200qjgcNgNi" : "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");


  //   const { body, uidCoach, uidClient, classID, duration, className, coachName, coachLastName, amount } = req.body;

  //   console.log(uidCoach)
  //   console.log(uidClient)

  //   const idempotencyKey = uuid4()
  //   const line1 = '510 Townsend St';
  //   const country = body.token.card.country;
  //   const email = body.token.email;

  //   console.log("befor charge")
  //   const customer = await stripe.customers.create({
  //     email: email,
  //     source: body.token.id,
  //     name: body.token.card.name,
  //     address: {
  //       line1: line1,
  //       city: body.token.card.city,
  //       state: body.token.card.state,
  //       country: country,
  //     }
  //   })

  //   console.log("after charge")


  //   const charge = await stripe.charges.create(
  //     {
  //       amount: amount * 100,
  //       currency: 'usd',
  //       customer: customer.id,
  //       receipt_email: body.token.email,
  //       description: 'purchase of ${product.name}',
  //       shipping: {
  //         name: body.token.card.name,
  //         address: {
  //           line1: body.token.card.address_line1,
  //           line2: body.token.card.address_line2,
  //           city: body.token.card.address_city,
  //           state: body.token.card.address_state,
  //           country: body.token.card.address_country

  //         }
  //       }
  //     },
  //     {
  //       idempotencyKey
  //     }, (error) => {
  //       console.log("-----------------------")
  //       console.log(error.statusCode)
  //       //throw(error.type)
  //       res.send(error.statusCode)
  //     });




  //   if (charge.status === "succeeded") {
  //     await firestoreCollection('stripe_one_time_payment', isDebug).doc().set({
  //       customer_id: charge.customer,
  //       email: email,
  //       type: "oneTimePayment",
  //       status: charge.status,
  //       uidCoach: uidCoach,
  //       uidClient: uidClient,
  //       duration: duration,
  //       className: className,
  //       coachName: coachName,
  //       coachLastName: coachLastName,
  //       price: amount
  //     });



  //     //setting clients stats collection
  //     let docIDCoachClient = uidCoach + uidClient

  //     const docReference = firestoreCollection('clients_stats', isDebug).doc(docIDCoachClient);


  //     return db.runTransaction(function (transaction) {
  //       return transaction.get(docReference).then(function (doc) {
  //         if (!doc.exists) {
  //           console.log("yoooo")
  //           const snap = (firestoreCollection(`clients_stats`, isDebug).doc(docIDCoachClient)).set({
  //             clientUid: uidClient,
  //             coachUid: uidCoach,
  //             contribution: 0,
  //             subscription: 0,
  //             dropins: amount,
  //             attendedCount: 0,
  //             lastAttended: "",
  //             bookedCount: 0
  //           }, { merge: true })
  //         }
  //         else {
  //           console.log("yayyay")
  //           var newDropIn = doc.data().dropins + amount
  //           transaction.update(docReference, { dropins: newDropIn });
  //         }
  //         return;
  //       });

  //     }).then(function () {
  //       console.log("transaction successful")
  //       res.json({ 'charge': charge, 'paymentStatus': charge.status });
  //       return;
  //     })
  //       .catch(function (error) {
  //         console.log(error)
  //         throw (error)
  //       })


  //   }

  //   else {
  //     res.send(400)
  //   }

  // });

  app.post('/payment', async (req, res) => {

  console.log(req.method)

  const { amount, uidCoach, code, uidClient, classID, duration, className, coachName, coachLastName } = req.body;

//const { body, uidCoach, uidClient, classID, duration, className, coachName, coachLastName, amount } = req.body;



  console.log(amount)
  console.log(typeof amount)
  const stripe = stripeInitializer("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");
  console.log("inside backend one time")
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: code,
          product_data: {
            name: 'Urban Studio',
          },
          unit_amount: amount*100,
        },
        quantity: 1,
         
      },

    ],
    mode: 'payment',
    success_url: 'https://app.urban.studio/payment-success/book-onetime/' + uidCoach + "/" +  amount + "/" + classID + "/" + code,
    cancel_url: 'https://app.urban.studio',
  });



  res.json({ id: session.id });
});



  // app.post(getEndPoint("/payment"), async (req, res) => {

  //   const stripe = stripeInitializer("sk_test_ZLn2Zl9F4yOlCABQ9OdjwuA200qjgcNgNi");


  //   const { body, uidCoach, uidClient, classID, duration, className, coachName, coachLastName, amount } = req.body;

  //   console.log(amount)
  //   console.log(typeof amount)
  //   console.log(uidClient)

  //   const idempotencyKey = uuid4()
  //   const line1 = '510 Townsend St';
  //   const country = body.token.card.country;
  //   const email = body.token.email;

  //   console.log("befor charge")
  //   const customer = await stripe.customers.create({
  //     email: email,
  //     source: body.token.id,
  //     name: body.token.card.name,
  //     address: {
  //       line1: line1,
  //       city: body.token.card.city,
  //       state: body.token.card.state,
  //       country: country,
  //     }
  //   })

    


  //   const charge = await stripe.charges.create(
  //     {
  //       amount: amount * 100,
  //       currency: 'usd',
  //       customer: customer.id,
  //       receipt_email: body.token.email,
  //       description: 'purchase of ${product.name}',
  //       shipping: {
  //         name: body.token.card.name,
  //         address: {
  //           line1: '510 Townsend St',
  //           postal_code: '98140',
  //           city: 'San Francisco',
  //           state: 'CA',
  //           country: 'US',
  //         }
  //       }
  //     },
  //     {
  //       idempotencyKey
  //     }, (error) => {
  //       console.log("-----------------------")
  //       console.log(error.statusCode)
  //       //throw(error.type)
  //       res.send(error)
  //     });

  //   console.log(charge)

  //   console.log("after charge")
    
  //   const isDebug=true

  //   if (charge.status === "succeeded") {
  //     await firestoreCollection('stripe_one_time_payment', isDebug).doc().set({
  //       customer_id: charge.customer,
  //       email: email,
  //       type: "oneTimePayment",
  //       status: charge.status,
  //       uidCoach: uidCoach,
  //       uidClient: uidClient,
  //       duration: duration,
  //       className: className,
  //       coachName: coachName,
  //       coachLastName: coachLastName,
  //       price: amount
  //     });



  //     //setting clients stats collection
  //     let docIDCoachClient = uidCoach + uidClient

  //     const docReference = firestoreCollection('clients_stats', isDebug).doc(docIDCoachClient);


  //     return db.runTransaction(function (transaction) {
  //       return transaction.get(docReference).then(function (doc) {
  //         if (!doc.exists) {
  //           console.log("yoooo")
  //           const snap = (firestoreCollection(`clients_stats`, isDebug).doc(docIDCoachClient)).set({
  //             clientUid: uidClient,
  //             coachUid: uidCoach,
  //             contribution: 0,
  //             subscription: 0,
  //             dropins: amount,
  //             attendedCount: 0,
  //             lastAttended: "",
  //             bookedCount: 0
  //           }, { merge: true })
  //         }
  //         else {
  //           console.log("yayyay")
  //           var newDropIn = doc.data().dropins + amount
  //           transaction.update(docReference, { dropins: newDropIn });
  //         }
  //         return;
  //       });

  //     }).then(function () {
  //       console.log("transaction successful")
  //       res.json({ 'charge': charge, 'paymentStatus': charge.status });
  //       return;
  //     })
  //       .catch(function (error) {
  //         console.log(error)
  //         throw (error)
  //       })


  //   }

  //   else {
  //     res.send(400)
  //   }

  // });


}