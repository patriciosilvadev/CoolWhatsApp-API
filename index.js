const WhatsAppWeb = require('baileys')
const fs = require('fs')
const client = new WhatsAppWeb();

const buffer = fs.readFileSync("jerry.png") // load some gif


var admin = require("firebase-admin");

var serviceAccount = require("./agilan-whatsapp-bot-firebase-adminsdk-rzlm2-5b2dae4de8.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://agilan-whatsapp-bot.firebaseio.com"
});

var db = admin.database();

async function send_hi(numb) {
    /*
    var options = { caption: `\n_HELLO *FRIEND*_ 😉,\n\nWishing you a GREAT LIFE ahead...\n    💯💥🏁😎\n\nThank you for visiting *WhatsApp-AGILAN*\n    👍👍👍\n\n` }
    return client.sendMediaMessage(numb + "@s.whatsapp.net", buffer, "imageMessage", options);
*/

    var msg_cnt;
    await db.ref("cnt").transaction(function (cur_cnt) {
        msg_cnt = cur_cnt;
        return cur_cnt + 1;
    })
    db.ref("hist").push([(numb.slice(0, 6) + ("****") + numb.slice(10)), Date.now()]);

    var options = { caption: `\n_HELLO *FRIEND*_ 😉,\n\nWishing you a GREAT LIFE ahead...\n    💯💥🏁😎\n\nThank you for visiting *WhatsApp-AGILAN*\n    👍👍👍\n\nMessage No. : *${msg_cnt + 1}*\n\n` }
    return client.sendMediaMessage(numb + "@s.whatsapp.net", buffer, "imageMessage", options);
    
}

async function send_mess(num,cn) {

    if (!client.conn) {
        await client.connectSlim({
            "clientID": "k6HmHsN+m6kvQDXkVmnstw==",
            "serverToken": "1@UM4thm4i2LliqdRCXT3vORIRvMDB8DfvogVHaWtnWbDIy+uC5p/7ZveRgpdIWPpF6uN95iswBhzOAg==",
            "clientToken": "3Iq1UZNOEyRBlJRndxx6ZW53jPXzSyN7G1z6gPKDkcY=",
            "encKey": "FOKLoC/CSAiIIO0q/B3iMoMv7SuArmLQIso31F55h9A=",
            "macKey": "emYDvpaYZsUIuq0Wh+Qg1JUuKQydFL/VZkRwknipMhM="
        }, 20000)
    }



    var full_num = cn + num;
    console.log(full_num);


    var end_mes;
    var snap = await db.ref("num/" + full_num).once("value");
    if (!snap.exists()) {
        db.ref("num/" + full_num).set(1);
        await send_hi(full_num);
        end_mes = "sent";
    } else {
        if (snap.val() < 5) {
            await send_hi(full_num);
            db.ref("num/" + full_num).set(snap.val() + 1);
            end_mes = "sent";
        } else {
            end_mes = "limit";
        }
    }


    return ({
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(end_mes),

    })




    //.catch(err => console.log("unexpected error: " + err))
}
exports.handler = async (event) => {

    var num = event.queryStringParameters.num;
    var cn = event.queryStringParameters.cn || "91";			

    if (num) {
        return (await send_mess(num,cn));
    }
}
