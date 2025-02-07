function setupRewardedAd(targetUrl, alwaysShowAd = false, dataFnKey, buttonId) {
  window.googletag = window.googletag || { cmd: [] };

  // Check if the ad has already been shown for this button
  const adShownKey = `adShown_${buttonId}`;
  if (buttonId && sessionStorage.getItem(adShownKey)) {
    console.log(`Ad already shown for button ${buttonId}.`);
    return;
  }
  // Check if the daily reward ad has been shown twice
  if (
    dataFnKey === "dailyReward" &&
    sessionStorage.getItem("dailyRewardAdShown") >= 2
  ) {
    showToast("Daily reward Limit reached", "error", dataFnKey);
    return;
  }
  const rewardedSlot = googletag.defineOutOfPageSlot(
    "/23201071713/quizTcz_reward", // Replace with your actual ad slot ID
    googletag.enums.OutOfPageFormat.REWARDED
  );

  if (rewardedSlot) {
    rewardedSlot.addService(googletag.pubads());

    googletag.pubads().addEventListener("rewardedSlotReady", (event) => {
      event.makeRewardedVisible();
      updateStatus("Rewarded ad is active.");
    });

    googletag.pubads().addEventListener("rewardedSlotClosed", () => {
      // Increment the ad shown count for daily reward
      if (dataFnKey === "dailyReward") {
        if (rewardPayload) {
          let adShownCount = parseInt(
            sessionStorage.getItem("dailyRewardAdShown") || "0",
            10
          );
          adShownCount += 1;
          sessionStorage.setItem("dailyRewardAdShown", adShownCount);
          giveRewardAfterAds(dataFnKey, false); // Do not trigger extra toast
        }
      } else if (dataFnKey === "claimReward") {
        if (rewardPayload) {
          giveRewardAfterAds(dataFnKey, false); // Do not trigger extra toast
        }
      }
      if (dataFnKey && dataFnKey !== "dailyReward" && dataFnKey !== "claimReward") {
        setTimeout(
          () => giveRewardAfterAds(dataFnKey, true), // Reward but don't show extra toast
          [500]
        );
      }
    });
    if (dataFnKey === "dailyReward" || dataFnKey === "claimReward") {
      googletag.pubads().addEventListener("rewardedSlotGranted", (event) => {
        rewardPayload = event.payload;
        updateStatus("Reward granted.");
      });
    }

    googletag.pubads().addEventListener("slotRenderEnded", (event) => {
      if (event.slot === rewardedSlot && event.isEmpty) {
        updateStatus("No ad returned for rewarded ad slot.");
        let adShownCount = parseInt(
          sessionStorage.getItem("dailyRewardAdShown") || "0",
          10
        );
        adShownCount += 1;
        sessionStorage.setItem("dailyRewardAdShown", adShownCount);
        showToast("RewardAds not available", "error", dataFnKey); // Show only this toast
        setTimeout(
          () => giveRewardAfterAds(dataFnKey, true), // Reward but don't show extra toast
          [500]
        );
      }
      // Set sessionStorage flag after ad is shown for this button
      const adShownKey = `adShown_${buttonId}`;
      if (buttonId) {
        sessionStorage.setItem(adShownKey, "true");
      }
    });

    googletag.enableServices();
    googletag.display(rewardedSlot);
  } else {
    updateStatus("Rewarded ads are not supported on this page.");
    showToast("RewardAds not available", "error", dataFnKey); // Show only this toast
    setTimeout(
      () => giveRewardAfterAds(dataFnKey, true), // Reward but don't show extra toast
      [500]
    );
    const adShownKey = `adShown_${buttonId}`;
    if (buttonId && sessionStorage.getItem(adShownKey)) {
      sessionStorage.setItem(adShownKey, "true");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".watchAdButton").forEach((button) => {
    button.onclick = () => {
      const targetUrl = button.getAttribute("data-target");
      const alwaysShowAd =
        button.getAttribute("data-target") === "../quizPlay/";
      const dataFnKey = button.getAttribute("data-fn");
      const buttonId = button.getAttribute("data-button-id");

      // Reset toast and progress bar state
      const toast = document.querySelector(".toast");
      const progress = document.querySelector(".progress");
      toast.classList.remove("activeToast", "hidden");
      toast.classList.remove("success", "error");
      progress.classList.remove("activeToast");

      setupRewardedAd(targetUrl, alwaysShowAd, dataFnKey, buttonId);
    };
  });
});

function updateStatus(message) {
  console.log(message);
}

const navigationEntries = performance.getEntriesByType("navigation");
if (navigationEntries.length > 0 && navigationEntries[0].type === "reload") {
  sessionStorage.removeItem("adShown");
}

function giveRewardAfterAds(key = "", suppressToast = false) {
  if (key === "quiz-play") {
    watchAd(suppressToast, key);
  } else if (key === "quiz-play-home") {
    watchAd(suppressToast, key);
  } else if (key === "dailyReward") {
    handleDailyReward(suppressToast, key);
  } else if (key === "doubleWinning") {
    doubleWinning(suppressToast, key);
  } else if (key === "claimReward") {
    claimReward(suppressToast, key);
  }
}
// get the reward 100 coin when not have entry fees.
function watchAd(suppressToast = false, key = "") {
  const getCoins = parseInt(localStorage.getItem("TotalCoin")) || 0;
  const totalReward = getCoins + 100;
  localStorage.setItem("TotalCoin", totalReward);

  if (!suppressToast) {
    showToast("100 Coins Rewarded!", "success", key);
  }
}

// function get the daily rewards.
function handleDailyReward(suppressToast = false, key = "") {
  const today = new Date().toISOString().split("T")[0];
  const rewardData = JSON.parse(localStorage.getItem("rewardData")) || {};
  const totalCoinsDisplay = document.getElementById("totalCoinsDisplay");

  if (!suppressToast) {
    showToast("You have received 100 coins!", "success", key);
  }
  if (rewardData.date !== today) {
    rewardData.date = today;
    rewardData.claims = 0;
    sessionStorage.removeItem("dailyRewardAdShown"); // Reset ad shown status for daily reward
  }

  if (rewardData.claims < 2) {
    rewardData.claims += 1;
    const totalCoins =
      parseInt(localStorage.getItem("TotalCoin") || "0", 10) + 100;
    localStorage.setItem("TotalCoin", totalCoins);
    totalCoinsDisplay.innerHTML = `${totalCoins} <span>COINS</span>`;
  }
  localStorage.setItem("rewardData", JSON.stringify(rewardData));
}

// Double your winning
function doubleWinning(suppressToast = false, key = "") {
  if (!suppressToast) {
    showToast(`2X Coins Rewarded`, "success", key);
  }
  const coins = localStorage.getItem("TotalCoinPerGame");
  const doubledCoins = parseInt(coins) * 2;
  localStorage.setItem("TotalCoinPerGame", doubledCoins);
  document.getElementById("coins-value").textContent = doubledCoins;
  localStorage.setItem("TotalCoin", doubledCoins);
}

function claimReward(suppressToast = false, key = "") {
  if (!suppressToast) {
    showToast(`100 Coins Rewarded !!`, "success", key);
  }
}

//Toaster
function showToast(message, type, key) {
  const toast = document.querySelector(".toast");
  const progress = document.querySelector(".progress");
  const closeIcon = document.querySelector(".close");

  document.querySelector(".toast .message .text-2").innerText = message;
  // Ensure toastElement is always defined and using the correct reference
  let toastElement = toast || document.createElement("div");
  const iconElement = toastElement.querySelector(".toast-content img");

  document.querySelector(".toast .message .text-2").innerText = message;
  setToastStyle(toastElement, iconElement, type, key);

  toast.classList.add("activeToast");
  progress.classList.add("activeToast");

  let timer1 = setTimeout(
    () => {
      toastElement.classList.remove("activeToast");
      toastElement.classList.add("hidden");
      redirectToPage(key);
    },
    key === "dailyReward"
      ? 5000
      : key === "doubleWinning" || key === "claimReward"
      ? 3000
      : 1000
  );

  closeIcon.addEventListener("click", () => {
    toastElement.classList.remove("activeToast");
    progress.classList.remove("activeToast");
    toastElement.classList.remove("hidden");
    redirectToPage(key);
    clearTimeout(timer1);
  });
}

// Helper function to handle toast styling
function setToastStyle(toastElement, iconElement, type, key) {
  if (type === "success") {
    toastElement.classList.add("success");
    iconElement.src = getToastIconSrc(key, "success");
    iconElement.alt = "reward";
  } else if (type === "error") {
    toastElement.classList.add("error");
    iconElement.src = getToastIconSrc(key, "error");
    iconElement.alt = "error";
  }
}

// Helper function for redirect logic
function redirectToPage(key) {
  if (key === "quiz-play") {
    window.location.href = "quizPlay/quiz";
    document.getElementById("rewardContainer").classList.add("hidden");
  } else if (key === "quiz-play-home") {
    window.location.href = "../../categories/quizzesForCategory/quizPlay/quiz/";
    document.getElementById("rewardContainer").classList.add("hidden");
  } else if (key === "doubleWinning") {
    window.location.href = "/home/";
    clearLocalStorage();
  } else if (key === "claimReward") {
    window.location.href = "../quizPlay/";
    // Add 'hidden' class from rewardContainer
    document.getElementById("rewardContainer").classList.add("hidden");
    // Remove 'hidden' class to mainContainer
    document.getElementById("mainContainer").classList.remove("hidden");
  } else {
    console.error("Unknown key for redirection:", key);
  }
}

// Helper function to get the appropriate icon source for the toast
function getToastIconSrc(key, type) {
  const basePaths = {
    success: "../../../assets/images/gif/rewarded.gif", // Success icon for quiz-play etc.
    error: "../../../assets/images/svg/alert.svg", // Error icon for errors
  };

  // Use the success icon for both success and dailyReward
  if (key === "dailyReward") {
    if (type === "success") {
      return "../../../assets/images/svg/correct.svg"; // Specific success icon for dailyReward
    } else if (type === "error") {
      return "../../../assets/images/svg/alert.svg"; // Specific error icon for dailyReward
    }
  }
  // Use the success icon for both success and dailyReward
  if (key === "doubleWinning") {
    if (type === "success") {
      return "../../../../../assets/images/svg/correct.svg"; // Specific success icon for dailyReward
    } else if (type === "error") {
      return "../../../../../assets/images/svg/alert.svg"; // Specific error icon for dailyReward
    }
  }

  return basePaths[type];
}

function clearLocalStorage() {
  localStorage.removeItem("TotalCoinPerGame");
  localStorage.removeItem("quizScore");
  localStorage.removeItem("selectedCategory");
  localStorage.removeItem("selectedQuiz");
  localStorage.removeItem("selectedCategoryPath");
  localStorage.removeItem("quizPlayed");
}
