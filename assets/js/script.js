document.addEventListener("DOMContentLoaded", () => {
  const questionContainers = document.querySelectorAll(".questionContainer");
  let currentQuestionIndex = 0;
  const coinsPerCorrectAnswer = 50;
  let correctAnswersCount = 0;
  let isMounted = false;

  let rewardCoin = sessionStorage.getItem("RewardCoin");

  // If CurrentUser is found in localStorage, navigate to home
  if (rewardCoin && !isMounted) {
    window.location.href = "home";
  }

  function clearLocalStorage() {
    localStorage.removeItem("TotalCoinPerGame");
    localStorage.removeItem("quizScore");
    localStorage.removeItem("selectedCategory");
    localStorage.removeItem("selectedQuiz");
    localStorage.removeItem("selectedCategoryPath");
    localStorage.removeItem("quizPlayed");
    localStorage.removeItem("TotalCoin");
    localStorage.removeItem("rewardData");
  }
  clearLocalStorage();

  // Initialize total coins in localStorage if not already set
  if (!localStorage.getItem("TotalCoin")) {
    localStorage.setItem("TotalCoin", "0");
  }

  // Function to handle Quiz option click
  function handleOptionClick(option, options) {
    // Check if the option is already selected
    if (!option.classList.contains("selected")) {
      // Remove 'selected' class from all options in the current question
      options.forEach((opt) => opt.classList.remove("selected"));

      // Add 'selected' class to the clicked option
      option.classList.add("selected");

      // Check if the clicked option is correct
      if (option.getAttribute("data-correct") === "true") {
        option.style.backgroundColor = "green"; // Correct answer
        correctAnswersCount++; // Increment correct answers count
      } else {
        option.style.backgroundColor = "red"; // Incorrect answer
        // Highlight the correct answer
        options.forEach((opt) => {
          if (opt.getAttribute("data-correct") === "true") {
            opt.style.backgroundColor = "green";
          }
        });
      }

      // Disable further selection for this question
      options.forEach((opt) => {
        opt.style.pointerEvents = "none";
      });

      // Wait for 2 seconds before moving to the next question
      setTimeout(() => {
        // Hide current question
        questionContainers[currentQuestionIndex].classList.add("hidden");

        // Show next question or update coins if last question
        currentQuestionIndex++;
        if (currentQuestionIndex < questionContainers.length) {
          questionContainers[currentQuestionIndex].classList.remove("hidden");
        } else {
          // Update the coin count after all questions are answered
          let getCoins = parseInt(localStorage.getItem("TotalCoin"), 10);
          rewardCoin = correctAnswersCount * coinsPerCorrectAnswer + 100;
          const totalCoins = getCoins + rewardCoin;
          localStorage.setItem("TotalCoin", totalCoins.toString());
          sessionStorage.setItem("RewardCoin", rewardCoin.toString());

          // Trigger interstitial ad before showing the modal
          googletag.cmd.push(() => {
              console.log("interstitialSlot", interstitialSlot);
            googletag.display(interstitialSlot);
          });

          // Remove 'hidden' class from rewardContainer
          document.getElementById("rewardContainer").classList.remove("hidden");
          // Add 'hidden' class to mainContainer
          document.getElementById("mainContainer").classList.add("hidden");
        }
      }, 500); // 500 milliseconds = 0.5 second
    }
  }
  // Ensure only the first question is visible initially
  questionContainers.forEach((container, index) => {
    if (index !== currentQuestionIndex) {
      container.classList.add("hidden");
    }
  });
  questionContainers.forEach((container) => {
    const options = container.querySelectorAll(".option");
    options.forEach((option) => {
      option.addEventListener("click", () =>
        handleOptionClick(option, options)
      );
    });
  });
  isMounted = true;
});
