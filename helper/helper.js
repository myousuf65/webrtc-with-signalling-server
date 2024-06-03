import { db } from "../config/firebaseConfig.js";
import { addDoc, setDoc,  collection, doc } from "firebase/firestore";


export function helloWorld (data) {
  console.log('hello world', data)
}
