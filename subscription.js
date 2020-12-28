const stripeInitializer = require("stripe");

const { getEndPoint, firestoreDocument, firestoreCollection, firebaseDocumentFromRef, firebaseCollectionFromRef } = require('./helper.js')


const functions = require('firebase-functions');

const db = require('./firebase-init.js')


module.exports = (app, isDebug = false) => {

  app.post(getEndPoint('/createPrice', isDebug), async (req, res) => {



    const stripe = stripeInitializer(isDebug ? "sk_test_ZLn2Zl9F4yOlCABQ9OdjwuA200qjgcNgNi" : "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");

    console.log("hahahhah");
    const { productPrice, uidCoach, recurring, userName } = req.body;
    console.log(userName)
    console.log("lolololol");

    const product = await stripe.products.create({
      name: "subscription",
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: productPrice,
      currency: 'usd',
      recurring: {
        interval: recurring,
      },
    });



    if (recurring === "week") {
      await firestoreCollection('subscription_plans', isDebug).doc(userName).set({
        priceWeek: price,
      }, { merge: true });
    }

    if (recurring === "month") {
      await firestoreCollection('subscription_plans', isDebug).doc(userName).set({
        priceMonth: price,
      }, { merge: true });
    }




    res.send(price);

  })



  app.post(getEndPoint('/sub', isDebug), async (req, res) => {
    const { email, payment_method, uidClient, uidCoach, priceID, recurring } = req.body;

    // const product = await stripe.products.create({
    //       name: "productName",
    //   }); 

    //  const price = await stripe.prices.create({
    //    product: product.id,
    //    unit_amount: 40000,
    //    currency: 'inr',
    //    recurring: {
    //      interval: 'day',
    //    },
    //  });



    const customer = await stripe.customers.create({
      name: 'ankit',
      payment_method: payment_method,
      email: email,
      invoice_settings: {
        default_payment_method: payment_method,
      },
      address: {
        line1: '510 Townsend St',
        postal_code: '98140',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',

      }
    });


    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: priceID }],
      expand: ['latest_invoice.payment_intent']
    }, (error) => {
      console.log("-----------------------")
      console.log(error.statusCode)
      //throw(error.type)
      res.send(error)
    });


    // console.log(subscription['latest_invoice'].total)
    // console.log(subscription)


    if (subscription['latest_invoice']['status'] === "paid") {

      await firestoreCollection('stripe_subscription', isDebug).doc().set({
        customer_id: customer.id,
        subscriptionID: subscription['latest_invoice']['subscription'],
        status: subscription['latest_invoice']['status'],
        email: customer.email,
        type: "subscription",
        uidClient: uidClient,
        uidCoach: uidCoach,
        exipresOn: new Date(subscription.current_period_end * 1000),
        amount: subscription['latest_invoice'].total,
        recurring: recurring
      });




      //setting clients stats collection
      let docIDCoachClient = uidCoach + uidClient

      const docReference = firestoreCollection('clients_stats', isDebug).doc(docIDCoachClient);

      // const docPath = await (db.collection('clients_stats').doc(docIDCoachClient));


      db.runTransaction(function (transaction) {
        return transaction.get(docReference).then(function (doc) {
          if (!doc.exists) {

            const snap = (firestoreCollection(`clients_stats`, isDebug).doc(docIDCoachClient)).set({
              clientUid: uidClient,
              coachUid: uidCoach,
              contribution: 0,
              subscription: subscription['latest_invoice'].total,
              dropins: amount,
              attendedCount: 0,
              lastAttended: "",
              bookedCount: 0
            }, { merge: true })
          }
          else {
            var newSubscription = doc.data().subscription + subscription['latest_invoice'].total;
            transaction.update(docReference, { subscription: newSubscription });
          }
          return;
        });

      }).then(function () {

        res.json({ 'subscriptionID': subscription['latest_invoice']['subscription'], 'status': subscription['latest_invoice']['status'] });
        return;
      })
        .catch(function (error) {
          console.log(error)
          throw (error)
        })


    }


    else {
      res.send(400)
    }




  });

}
