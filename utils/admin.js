const admin = require("firebase-admin/app");
require("dotenv").config()

// require("firebase/firestore");

// const cred = require("./getKey")
var serviceAccount = require("./key.json");
admin.initializeApp({
    credential: admin.applicationDefault(),
    databaseURL: "https://kotanipayassessment-default-rtdb.firebaseio.com"
});
const db = admin.firestore();

const { functions } = require("firebase");
const firebase = require("firebase");
module.exports = { admin, db, firebase };