const WhatsAppWeb = require('baileys')
const fs = require('fs')
const client = new WhatsAppWeb();
const url = require('url');
const http = require('http');

const firebase = require('firebase/app');
require('firebase/database')


var firebaseConfig = {
    apiKey: "AIzaSyB1qs8BOyxPJ62nYi5KT9QWdMjP9Qgadcc",
    authDomain: "agilan-whatsapp-bot.firebaseapp.com",
    databaseURL: "https://agilan-whatsapp-bot.firebaseio.com",
    projectId: "agilan-whatsapp-bot",
    storageBucket: "agilan-whatsapp-bot.appspot.com",
    messagingSenderId: "824056421325",
    appId: "1:824056421325:web:7a47694c0abdb5f4e20284"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.database();


const buffer = fs.readFileSync("jerry.png") // load some gif

function send_hi(numb) {
    var msg_cnt;
    db.ref("cnt").transaction(function (cur_cnt) {
        msg_cnt = cur_cnt;
        return cur_cnt + 1;
    }, function () {
        var options = { caption: `\n_HELLO *FRIEND*_ 😉,\n\nWishing you a GREAT LIFE ahead...\n    💯💥🏁😎\n\nThank you for visiting *WhatsApp-AGILAN*\n    👍👍👍\n\nMessage No. : *${msg_cnt + 1}*\n\n` }
        client.sendMediaMessage(numb + "@s.whatsapp.net", buffer, "imageMessage", options);
    });
    db.ref("hist").push([(numb.slice(0, 6) + ("****") + numb.slice(10)), Date.now()]);

}


client.connectSlim({
	"clientID": "HsXuRsPiTPHVd3ulBE4rTw==",
	"serverToken": "1@GbI0CgG6Dyrq7aTotBF2maZUwWUUSZZ5rTTSMONRXjKPzHZK6b6082ge5Dmq0Bzlm3iMwxMPhqi0+w==",
	"clientToken": "nyYc8f+SIGjDlIR8HakuVZowRrEQWVIPjNvwFixMO54=",
	"encKey": "5BNn9j79Sp7LTYEdEbSqC8XPWgeYDSsJNGPjXJ7bZjQ=",
	"macKey": "Aewy9bmBPS6GNlSQZ1nVi/Y7uML7mjGZMTwjmk2y6/U="
}, 20000)
    .then((user) => {
        http.createServer((req, res) => {
            var q = url.parse(req.url, true);
            if (q.pathname == "/send") {
                if (q.query.num) {
                    var full_num = (q.query.cn||"91") + q.query.num;
                    db.ref("num/" + full_num).once("value", function (snap) {
                        if (!snap.exists()) {
                            db.ref("num/" + full_num).set(1);
                            send_hi(full_num);
                            res.end("sent");
                        } else {
                            if (snap.val() < 5) {
                                send_hi(full_num);
                                db.ref("num/" + full_num).set(snap.val() + 1);
                                res.end("sent");
                            } else {
                                res.end("limit");
                            }
                        }
                    })
                }
                return;
            }
            res.end();
        }).listen(process.env.PORT || '3000', () => console.log("listening"))
    })
    //.catch(err => console.log("unexpected error: " + err))