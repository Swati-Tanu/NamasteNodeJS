const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns"); // alternative "moment"
const ConnectionRequest = require("../models/connectionRequest");
const { sendTestEmail } = require("../services/sendMail");

//? This cron will run every day at 8:00 AM.
//? It will send a mail to every user with the list of people who send the request in past 24 hours.
cron.schedule("* 8 * * *", async () => {
  try {
    // Calculating yesterday's date
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    //? 1. Status should be "interested"
    //? 2. createdAt should be between yesterday - today
    //? 3. Get data of fromUser and toUser
    //? 4. Get the email of the receiving user
    const pendingRequests = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    //? Finding emailIds
    const listOfEmails = [
      ...new Set(pendingRequests.map((el) => el.toUserId.emailId)),
    ];

    for (const email of listOfEmails) {
      try {
        const response = await sendTestEmail(
          "example@example.com",
          "Pending Request!",
          "New Friend Requests pending send by " +
            email +
            ". There are so many frined reuests pending, please login to DevTinder.in and accept or reject the reqyests."
        );
        // console.log("Email response", response);
      } catch (error) {
        console.log(error);
      }
    }

    //? Logic for sending emails
  } catch (error) {
    console.error(error);
  }
});
