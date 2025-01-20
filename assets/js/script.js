document.addEventListener("DOMContentLoaded", () => {
  const questionContainers = document.querySelectorAll(".questionContainer");
  let currentQuestionIndex = 0;
  const coinsPerCorrectAnswer = 50;
  let correctAnswersCount = 0;

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
        let totalCoins = parseInt(localStorage.getItem("TotalCoin"), 10);
        totalCoins += correctAnswersCount * coinsPerCorrectAnswer;
        rewardCoin = correctAnswersCount * coinsPerCorrectAnswer;
        localStorage.setItem("RewardCoin", rewardCoin.toString());
        localStorage.setItem("TotalCoin", totalCoins.toString());
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
});
