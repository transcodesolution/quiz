document.addEventListener("DOMContentLoaded", () => {
    const questionContainers = document.querySelectorAll(".questionContainer");
    let currentQuestionIndex = 0;

    // Function to handle Quiz option click
    function handleOptionClick(option, options) {
        // Remove 'selected' class from all options in the current question
        options.forEach((opt) => opt.classList.remove("selected"));

        // Add 'selected' class to the clicked option
        option.classList.add("selected");
        option.style.backgroundColor = "green"; // Change color to green

        // Wait for 2 seconds before moving to the next question
        setTimeout(() => {
            // Hide current question
            questionContainers[currentQuestionIndex].classList.add("hidden");

            // Show next question
            currentQuestionIndex++;
            if (currentQuestionIndex < questionContainers.length) {
                questionContainers[currentQuestionIndex].classList.remove("hidden");
            }
        }, 1000); // 2000 milliseconds = 2 seconds
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
