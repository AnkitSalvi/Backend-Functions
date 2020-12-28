// var admin = require("firebase-admin");

// var serviceAccount = require("./serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://fir-auth-app-f6a98.firebaseio.com/"
// });


// var db = admin.firestore(); 


  

//   module.exports = (app) => {
    
//     app.post('/postuserdb',(req,res)=>{


//       const {uid, name, lastName, profileUrl, bio} = req.body;
//       console.log(uid)

//       db.collection('Users').doc(uid).set({
//         name:name,
//         lastName: lastName,
//         profileUrl:profileUrl,
//         bio:bio,
//         classListing:null
//       })
//       .then(() => {
//         console.log('user added successfully');
//       })
//       .catch(error =>{
//         console.error(error);
//       })
  
 
//     });

//     app.post('/postclassdb',(req,res)=>{


//      const {uid, className, classDesc, classTypeGrouporPrivate, paymentType, capacity, duration, classTypeRecurringorNot, timezone, startDateTime, repeatOn, noOfWeeks, classStartDate, classStartTime} = req.body;

//      const classID = db.collection('classes').doc().id;
  

//      console.log(classStartTime);
  

//       db.collection('classes').doc(classID).set({
//         creatorID:uid,
//         classID:classID,
//         className:className,
//         classDesc: classDesc,
//         classTypeGrouporPrivate:classTypeGrouporPrivate,
//         paymentType:paymentType,
//         capacity:capacity,
//         duration:duration,
//         classTypeRecurringorNot:classTypeRecurringorNot,
//         //timezone:timezone,
//         startDateTime:startDateTime,
//         repeatOn:repeatOn,
//         noOfWeeks:noOfWeeks,
//         classStartDate:classStartDate,
//         classStartTime:classStartTime
//       }, {merge:true})
//       .then(() => {
//         console.log('user added successfully');
//       })
//       .catch(error =>{
//         console.error(error);
//       })
  
 
//     });

//      app.get('/getclassdb',async(req,res)=>{
//       var responseArray=[];
//       const {uid} = req.query;
//       console.log(uid);
//       db.collection('classes').where("creatorID" , "==" ,uid).get()
//       .then(function(querySnapshot) {
       
//         querySnapshot.forEach(function(doc){
//           console.log(doc._fieldsProto)
//           responseArray.push(doc._fieldsProto)
//           //res.send(doc._fieldsProto)
//         })
//         res.send(responseArray)
//         //console.log(responseArray)
//         //res.send(querySnapshot._fieldsProto);
//       })
//       .catch(error =>{
//         console.error(error);
//       })
  
 
//     });



//     app.get('/getuserdb',async(req,res)=>{

//       const {uid} = req.query;
//       console.log(uid);
//       db.collection('Users').doc(uid).get()
//       .then(function(querySnapshot) {
//         res.send(querySnapshot._fieldsProto);
//       })
//       .catch(error =>{
//         console.error(error);
//       })
  
 
//     });
//   }