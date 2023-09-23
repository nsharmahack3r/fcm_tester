const express = require('express');
const app = express();
const NotificationHandler = require("./fcm");

const port = 3000;

app.use(express.json());
app.listen(port, ()=>{
    console.log("App running on http://localhost:3000");
});

app.post('/notify',(req, res)=>{
    const {fcmToken ,title, body, data} = req.body;
    NotificationHandler.notify(fcmToken ,title, body, data);
    res.send("Message sent");
});