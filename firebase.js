
// Import the functions we need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA5lFZWR8KaPhYyGPEGD3VI3Ziz5ANpau4",
  authDomain: "private-stream-4e400.firebaseapp.com",
  projectId: "private-stream-4e400",
  storageBucket: "private-stream-4e400.appspot.com",
  messagingSenderId: "333562639763",
  appId: "1:333562639763:web:08e551d7c52e5cebff2466"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize invisible reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
  'size': 'invisible'
}, auth);

// Function to send OTP
window.sendOTP = async function(name, phone) {
  if (!name || !phone) { alert("Enter name and phone"); return; }

  // Save user in Firestore
  try {
    await setDoc(doc(db, "users", phone), { name: name, phone: phone });
  } catch(e) { console.log("Firestore error:", e); }

  // Send OTP
  signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
    .then(confirmationResult => {
      window.confirmationResult = confirmationResult;
      alert("OTP sent to " + phone);
    })
    .catch(err => alert(err.message));
}

// Function to verify OTP
window.verifyOTP = function(code) {
  window.confirmationResult.confirm(code)
    .then(() => window.location.href = "stream.html")
    .catch(() => alert("Invalid OTP"));
}
