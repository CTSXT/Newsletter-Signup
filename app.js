const client = require("mailchimp-marketing");
//Requiring express and body parser and initializing the constant "app"
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
//Using bod-parser
app.use(bodyParser.urlencoded({ extended: true }));
//The public folder which holds the CSS
app.use(express.static("public"));
//Listening on port 3000 and if it goes well then logging a message saying that the server is running
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running at port 3000");
});
//Sending the signup.html file to the browser as soon as a request is made on localhost:3000
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
//Setting up MailChimp
client.setConfig({
  //*****************************ENTER YOUR API KEY HERE******************************
  apiKey: "17f01858790f6da7c54e6447c41a4a96-us14",
  //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
  server: "us14",
});
//As soon as the sign in button is pressed execute this
app.post("/", function (req, res) {
  //*****************************ENTER YOU LIST ID HERE******************************
  const listId = "2462cfb2c4";
  //Creating an object with the users data
  const subscribingUser = {
    firstName: req.body.fName,
    lastName: req.body.lName,
    email: req.body.mail,
  };
  //Uploading the data to the server
  const run = async () => {
    const response = await client.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });
    console.log(response);
    //If all goes well logging the contact's id
    res.sendFile(__dirname + "/success.html");
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${response.id}.`
    );
  };
  run();
  run().catch((e) => res.sendFile(__dirname + "/failure.html"));
});
app.post("/failure", function (req, res) {
  res.redirect("/");
});
