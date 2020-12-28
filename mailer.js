const nodemailer = require('nodemailer');

const ical = require('ical-generator');

var moment = require('moment');

const { getEndPoint, firestoreDocument, firestoreCollection, firebaseDocumentFromRef, firebaseCollectionFromRef } = require('./helper.js')


module.exports = (app, isDebug = false) => {

  app.post(getEndPoint('/mailCoach'), (req, res) => {

    const { email, uniqueUserName, start, duration, description, className, coachName, classStartDate, classStartHour, classStartMinutes } = req.body;

    const cal = ical({ domain: '', name: '' });

    console.log(email);
    console.log(new Date(start));
    console.log(duration);
    console.log(description)

    startDate = new Date(start)
    endDate = startDate.setMinutes(startDate.getMinutes() + duration)



    console.log(new Date(endDate))

    cal.createEvent({
      start: start,
      end: new Date(endDate),
      summary: className,
      description: description,
      location: '',
      url: ''
    });


    firestoreCollection('mail', isDebug).add({
      to: email,
      message: {
        subject: `Invitation: ${className} @ ${classStartDate} ${classStartHour} ${classStartMinutes} `,
        html: `<br/><br/>Hi ${uniqueUserName}, <br/>
                Thank you for scheduling ${className} @ ${classStartDate} ${classStartHour} ${classStartMinutes}.
              <br/> Click on the email attachement to add to your calender <br/> <br/> <br/> Regards, <br/>
              Team urban.studio`,
        icalEvent: {
          "method": 'request',
          "content": new Buffer(cal.toString()),
          "Content-Type": "text/calendar",
          "component": "VEVENT",
          "Content-Class": "urn:content-classes:calendarmessage"

        }
      },

    }, () => {
      console.log("success")
      res.send(200);
    })
  });

  app.post(getEndPoint('/mail', isDebug), (req, res) => {

    const { email, uniqueUserName, start, duration, description, className, coachName, classStartDate, classStartHour, classStartMinutes } = req.body;

    const cal = ical({ domain: '', name: '' });

    console.log(email);
    console.log(new Date(start));
    console.log(duration);
    console.log(description)

    startDate = new Date(start)
    endDate = startDate.setMinutes(startDate.getMinutes() + duration)



    console.log(new Date(endDate))

    cal.createEvent({
      start: start,
      end: new Date(endDate),
      summary: className,
      description: description,
      location: '',
      url: ''
    });


    firestoreCollection('mail', isDebug).add({
      to: email,
      message: {
        subject: `Invitation: ${className} with ${coachName} @ ${classStartDate} ${classStartHour} ${classStartMinutes} `,
        html: `Hi ${uniqueUserName}, <br/>
              Thank you for booking a seat at ${className} with ${coachName} @ ${classStartDate} ${classStartHour} ${classStartMinutes}.
              <br/> Click on the email attachement to add to your calender <br/> <br/> <br/> Regards, <br/>
              Team urban.studio`,
        icalEvent: {
          "method": 'request',
          "content": new Buffer(cal.toString()),
          "Content-Type": "text/calendar",
          "component": "VEVENT",
          "Content-Class": "urn:content-classes:calendarmessage"

        }
      },

    }, () => {
      console.log("success")
      res.send(200);
    })
  });
}




