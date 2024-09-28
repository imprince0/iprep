const connectToMongo= require('./db');
connectToMongo();

const express = require('express');
const app = express()
var cors = require('cors')
app.use(cors())

app.use(express.json());
app.use('/api/auth',require('./routes/auth'));
const axios = require('axios');

app.post('/compile',async(req,res)=>{
    let code = req.body.code;
    let language = req.body.language;
    let input = req.body.input;
    
    let version="latest";
    if(language==="python"){
        language="python3";
    }
    const options = {
        method: 'POST',
        url: 'https://online-code-compiler.p.rapidapi.com/v1/',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': '733396fa85msh8c11b6bb2372c2ap11c107jsn951af74deb34',
          'X-RapidAPI-Host': 'online-code-compiler.p.rapidapi.com'
        },
        data: {
          language: language,
          version: 'latest',
          code: code,
          input: input
        }
      };
      try {
        const response = await axios.request(options);
        res.send(response.data)
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
    })

 
let port=5000;


const Socket = require("websocket").server

const server=app.listen(5000, () => {
    console.log("Listening on port 5000...")
})

const webSocket = new Socket({ httpServer: server })
let users = []
webSocket.on('request', (req) => {
    const connection = req.accept()

    connection.on('message', (message) => {
        const data = JSON.parse(message.utf8Data)

        const user = findUser(data.username)

        switch(data.type) {
            case "store_user":

                if (user != null) {
                    return
                }
                const newUser = {
                     conn: connection,
                     username: data.username
                }
                users.push(newUser)
                console.log(newUser.username)
                break
            case "store_offer":
                if (user == null)
                    return
                user.offer = data.offer
                break
            
            case "store_candidate":
                if (user == null) {
                    return
                }
                if (user.candidates == null)
                    user.candidates = []
                
                user.candidates.push(data.candidate)
                break
            case "send_answer":
                if (user == null) {
                    return
                }

                sendData({
                    type: "answer",
                    answer: data.answer
                }, user.conn)
                break
            case "send_candidate":
                if (user == null) {
                    return
                }
                sendData({
                    type: "candidate",
                    candidate: data.candidate
                }, user.conn)
                break
            case "join_call":
                if (user == null) {
                    return
                }
                sendData({
                    type: "offer",
                    offer: user.offer
                }, connection)
                
                user.candidates.forEach(candidate => {
                    sendData({
                        type: "candidate",
                        candidate: candidate
                    }, connection)
                })
                break;
        }
    })

    connection.on('close', (reason, description) => {
        users.forEach(user => {
            if (user.conn == connection) {
                users.splice(users.indexOf(user), 1)
                return
            }
        })
    })
})

function sendData(data, conn) {
    conn.send(JSON.stringify(data))
}
function findUser(username) {
    for (let i = 0;i < users.length;i++) {
        if (users[i].username == username)
            return users[i]
    }
}