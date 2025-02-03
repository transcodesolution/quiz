document.addEventListener("DOMContentLoaded", function () {
  const dailyRewardButton = document.querySelector(".dailyReward");
  const totalCoinsDisplay = document.getElementById("totalCoinsDisplay");

  dailyRewardButton.addEventListener("click", handleDailyReward);

  function handleDailyReward() {
    const today = new Date().toISOString().split("T")[0];
    const rewardData = JSON.parse(localStorage.getItem("rewardData")) || {};

    if (rewardData.date !== today) {
      rewardData.date = today;
      rewardData.claims = 0;
    }

    if (rewardData.claims < 2) {
      rewardData.claims += 1;
      const totalCoins =
        parseInt(localStorage.getItem("TotalCoin") || "0", 10) + 100;
      localStorage.setItem("TotalCoin", totalCoins);
      totalCoinsDisplay.innerHTML = `${totalCoins} <span>COINS</span>`;
      showToast("You have received 100 coins!", "success");
    } else {
      showToast("Daily reward Limit reached", "error");
    }
    localStorage.setItem("rewardData", JSON.stringify(rewardData));
  }

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
          iconElement.src = "assets/images/svg/correct.svg";
          iconElement.alt = "success"; // Update alt text for better semantics
        }
      }
    }

    // Show toast
    toast.classList.add("toastActive");
    progress.classList.add("toastActive");

    // Auto-hide toast
    let timer1 = setTimeout(() => {
      toast.classList.remove("toastActive");
      toast.classList.add("hidden");
    }, 5000);

    let timer2 = setTimeout(() => {
      progress.classList.remove("toastActive");
      toast.classList.remove("hidden");
    }, 5300);

    // Close toast manually
    closeIcon.addEventListener("click", () => {
      toast.classList.remove("toastActive");
      progress.classList.remove("toastActive");
      toast.classList.remove("hidden");

      clearTimeout(timer1);
      clearTimeout(timer2);
    });
  }
});
