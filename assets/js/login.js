// Check if user is already logged in
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("CurrentUser");
  
  // If CurrentUser is found in localStorage, navigate to home
  if (currentUser) {
    window.location.href = "home";
  }
});

const firebaseConfig = {
  apiKey: "AIzaSyBwy4JH9X3R2o0aJRqPHKWKoIWBqciO9AA",
  authDomain: "quiz-dev-7a550.firebaseapp.com",
  databaseURL: "https://quiz-dev-7a550-default-rtdb.firebaseio.com",
  projectId: "quiz-dev-7a550",
  storageBucket: "quiz-dev-7a550.firebasestorage.app",
  messagingSenderId: "1078528656535",
  appId: "1:1078528656535:web:edf8b1730fe29d8d3815d2",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to the database
var quizAuth = firebase.database().ref("quiz-dev");

// Add event listener to login form
document.getElementById("login-form").addEventListener("submit", loginUser);

function loginUser(e) {
  e.preventDefault();

  // Get email and password values
  const emailId = getElementVal("email");
  const password = getElementVal("password");

  // Flag to track if a user is found
  let userFound = false;

  // Query the database for matching emailId and password
  quizAuth.once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();

      // Check if emailId and password match
      if (userData.emailId === emailId && userData.password === password) {
        userFound = true;
        localStorage.setItem(
          "CurrentUser",
          JSON.stringify({
            emailId: emailId,
            password: password,
          })
        );
      }
    });

    // Navigate to home page if user is found, else show alert
    if (userFound) {
      window.location.href = "home";
    } else {
      showToast("Wrong Email or Password", "error");
    }
  });
}

// Helper function to get input field value by ID
const getElementVal = (id) => {
  return document.getElementById(id).value;
};

function showToast(message, type) {
  const toast = document.querySelector(".toast");
  const progress = document.querySelector(".progress");
  const closeIcon = document.querySelector(".close");

  // Update toast message
  document.querySelector(".toast .message .text-2").innerText = message;
  if (type === "success") {
    const toastElement = document.querySelector(".toast");
    if (toastElement) {
      toastElement.classList.add("success");
      const iconElement = toastElement.querySelector(".toast-content img");
      if (iconElement) {
        iconElement.src = "../assets/images/svg/correct.svg";
        iconElement.alt = "success"; // Update alt text for better semantics
      }
    }
  }

  // Show toast
  toast.classList.add("active");
  progress.classList.add("active");

  // Auto-hide toast
  let timer1 = setTimeout(() => {
    toast.classList.remove("active");
    toast.classList.add("hidden");
  }, 5000);

  let timer2 = setTimeout(() => {
    progress.classList.remove("active");
    toast.classList.remove("hidden");
  }, 5300);

  // Close toast manually
  closeIcon.addEventListener("click", () => {
    toast.classList.remove("active");
    progress.classList.remove("active");
    toast.classList.remove("hidden");

    clearTimeout(timer1);
    clearTimeout(timer2);
  });
}
