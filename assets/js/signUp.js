// Check if user is already logged in
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("CurrentUser");
  
  // If CurrentUser is found in localStorage, navigate to home
  if (currentUser) {
    window.location.href = "home";
  }
});

const firebaseConfig = {
  apiKey: "AIzaSyBwy4jH9X3R2o0aJRqPHKWKoIWBqciO9AA",
  authDomain: "quiz-dev-7a550.firebaseapp.com",
  databaseURL: "https://quiz-dev-7a550-default-rtdb.firebaseio.com",
  projectId: "quiz-dev-7a550",
  storageBucket: "quiz-dev-7a550.appspot.com",
  messagingSenderId: "1078528656535",
  appId: "1:1078528656535:web:edf8b1730fe29d8d3815d2",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference your database
const quizAuth = firebase.database().ref("quiz-dev");

document.getElementById("signUp-form").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  const emailId = getElementVal("email");
  const password = getElementVal("password");

  checkEmailExists(emailId, password);
}

const checkEmailExists = (emailId, password) => {
  quizAuth
    .orderByChild("emailId")
    .equalTo(emailId)
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        showToast("You are already Signed up ,Try Logging up", "error");
        setTimeout(() => {
          window.location.href = "login";
        }, 3000);
      } else {
        // Save the new user if the email does not exist
        showToast("Sign Up Successful.Login to Play Quiz", "success");
        saveMessages(emailId, password);
        setTimeout(() => {
          window.location.href = "login";
        }, 3000);

        // Reset the form
        document.getElementById("signUp-form").reset();
      }
    });
};

const saveMessages = (emailId, password) => {
  const signUpDetail = quizAuth.push();

  signUpDetail.set({
    emailId: emailId,
    password: password,
  });
};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};

// Toaster Functionality
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
