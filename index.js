const { admin, db } = require("./utils/admin")
const functions = require("firebase-functions");
const app = require("express")(); //initializaing the app
const firebaseConfig = require(". / utils / config")
const firebase = require("firebase");
firebase.initializeApp(firebaseConfig); // Initializing Firebase
const { signIn, signUp, resetPassword } = require(". / handlers / auth");
// Creating Authentication routes:
app.post("/register", signUp);
app.post("/login", signIn);
exports.api = functions.https.onRequest(app)