const admin = require("firebase-admin");
const serviceAccount = require("../server-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});


class NotificationHandler {
    static async notify(fcmToken ,title, body, data){
        const notificationTag = 'native_notification';

        const androidNotification = {
            channelId: "DEFAULT_CHANNEL",
            clickAction:"FLUTTER_NOTIFICATION_CLICK",
            visibility:'public',
            priority: 'max',
            tag: notificationTag
        };
        const message = {
            token: fcmToken,
            notification:{
                title,
                body
            },
            data:data,
            apns: {
                payload: {
                    aps: {
                        sound:"default",
                        badge:1,
                        contentAvailable:true,
                        mutableContent:true,
                      },
                },
                headers: {
                    "apns-push-type": "background",
                    "apns-priority": "5",
                    "apns-topic": "io.flutter.plugins.firebase.messaging",
                    'apns-collapse-id': notificationTag,
                },
            },
            // android:{
            //     notification:androidNotification
            // }
                      
        };

        admin.messaging().send(message).then((messageID)=>{
            console.log(`notification sent to : ${fcmToken}`);
        });
    }

    static async sendMessageNotification(from, message, to){
        const title = `@${from.username}`;
        const data = {
            sender:`${from._id}`,
            message: message,
            sentAt: new Date(Date.now()).toISOString(),
            receiver: `${to._id}`,


            //User params
            _id: `${from._id}`,
            name: `${from.name}`,
            username:`${from.username}`,
            email:`${from.email}`

        }
        try{
            await NotificationHandler.notify(fcmToken, title, message, data);
        } catch(e){
            console.log(e);
        }
    }

    static async sendCallNotification(from, to, message, callType){
        const title = `@${from.username}`;
        const fcmToken = `${to.fcmToken}`;

        const data = {
            caller:`${from._id}`,
            type:callType,
            sentAt: new Date(Date.now()).toISOString(),
            receiver: `${to._id}`,


            //User params
            _id: `${from._id}`,
            name: `${from.name}`,
            username:`${from.username}`,
            email:`${from.email}`,
            avatar:`${from.avatar}`,

        }
        try{
            await NotificationHandler.notify(fcmToken, title, message, data);
        } catch(e){
            console.log(e);
        }
    }
}
module.exports =  NotificationHandler;