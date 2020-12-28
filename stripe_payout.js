const stripeInitializer = require("stripe");

const { getEndPoint, firestoreDocument, firestoreCollection, firebaseDocumentFromRef, firebaseCollectionFromRef } = require('./helper.js')


const functions = require('firebase-functions');

const db = require('./firebase-init.js')


module.exports = async (app, isDebug = false) => {


	app.post(getEndPoint('/payout', isDebug), async (req, res) => {


		const stripe = stripeInitializer(isDebug ? "sk_test_ZLn2Zl9F4yOlCABQ9OdjwuA200qjgcNgNi" : "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");

		const { email, payment_method, uidClient, uidCoach, priceID, recurring } = req.body;

		const account = await stripe.accounts.create({
			country: 'US',
			type: 'express',
			capabilities: {
				card_payments: {
					requested: true,
				},
				transfers: {
					requested: true,
				},
			},
		})

		//console.log(account)

		const accountLinks = await stripe.accountLinks.create({
			account: account.id,
			refresh_url: 'http://localhost:3000/login',
			return_url: 'http://localhost:3000/login',
			type: 'account_onboarding',
		});


		console.log(accountLinks);

		res.json({ 'url': accountLinks.url });



	});

}
