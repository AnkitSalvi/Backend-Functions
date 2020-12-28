
  module.exports = (app) => {

  	const apiPoints = [
  	"./donation.js",
  	"./payment.js",
  	"./mailer.js",
  	"./subscription.js",
  	"./stripe_payout.js",
  	]

  	apiPoints.forEach(apiPoint=>{
  		require(apiPoint)(app);
  		require(apiPoint)(app, true);
  	})

  }

