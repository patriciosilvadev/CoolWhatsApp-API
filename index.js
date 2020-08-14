const WhatsAppWeb = require('baileys')
const fs =require('fs')
const client = new WhatsAppWeb()
client.connectSlim({
    "clientID": "A2QyClnQ9jHTJGQM/X4dlg==",
    "serverToken": "1@sSjuKXv/XIHo48THR5QUsdItjANEWQ/w4d0WmwT/4duUCE3q5K1TV0FDgIpWe9WvpbV0aqG+QmuZxw==",
    "clientToken": "+J48Nv/+L8ZwHgcCmGVqurM6jm+wVCc/58BPJaSo7s8=",
    "encKey": "v2/IL3QMjy9/aFHAofH7vPReef1fHMp0MlIn5JNVjlw=",
    "macKey": "+bkfKXCq77w3SOnslklo3qhGjPusCeIUhQIYXg5YaY8="
}, 20000)
    .then((user) => {
        console.log("oh hello " + user.name + " (" + user.id + ")")
        //console.log("you have " + unread.length + " unread messages")
        //console.log("you have " + chats.length + " chats")

        const buffer = fs.readFileSync("jerry.png") // load some gif
        const options = {caption: "hello!" } // some metadata & caption
        client.sendMediaMessage("918098255246@s.whatsapp.net", buffer,"imageMessage", options)


    })
    //.catch(err => console.log("unexpected error: " + err))