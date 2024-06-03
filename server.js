import http  from "http";
import url from "url";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import {Server } from "socket.io"
import { db } from "./config/firebaseConfig.js";
import { doc, collection, addDoc, setDoc, getDoc } from "firebase/firestore";
 
const app = express()
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./public/"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());



const server = http.createServer(app)
const io = new Server(server, {
  cors : {
    origin: ["https://admin.socket.io"],
    credentials: true
  }
})


io.on('connection', (socket, callback)=>{
  console.log('new client connected')

  socket.on('offer', async (data, callback)=>{
    const callDoc =  doc(collection(db, 'calls'))
    const offerCandidates = collection(callDoc, 'offerCandidates')
  
    await setDoc(callDoc, data)
    callback(callDoc.id)
  })

  socket.on('ice-candidates', async(candidate, doc_id, callback)=>{
    
    // let doc = db.collection('call-id').doc(doc_id).get()
    let doc = getDoc(doc(db, 'call-id', doc_id))

    console.log(doc)
    callback(doc)
  })
  
})


app.get('/', (req, res)=>{
  // console.log(db)
  res.render("videoCall", {
    db : db
  })
})

app.get("/m", (req, res) =>{

})


server.listen(9898, ()=>{
  console.log("http server is listening on port, 9898")
})

