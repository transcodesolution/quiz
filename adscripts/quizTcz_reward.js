function showAdLoader() {
  let overlay = document.getElementById("adLoaderOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "adLoaderOverlay";
    overlay.innerHTML = `
      <div class="ad-loader-content">
        <div class="ad-loader-spinner"></div>
        <p class="ad-loader-text">Loading Ad...</p>
      </div>
    `;
    const style = document.createElement("style");
    style.textContent = `
      #adLoaderOverlay {
        position: fixed; inset: 0; z-index: 99999;
        background: rgba(0,0,0,0.7);
        display: flex; align-items: center; justify-content: center;
        backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
      }
      .ad-loader-content { text-align: center; }
      .ad-loader-spinner {
        width: 48px; height: 48px; margin: 0 auto 16px;
        border: 4px solid rgba(255,255,255,0.2);
        border-top-color: #ffcc5b;
        border-radius: 50%;
        animation: adSpin 0.8s linear infinite;
      }
      .ad-loader-text {
        color: #fff; font-size: 16px; font-family: "Roboto", sans-serif;
        letter-spacing: 0.5px;
      }
      @keyframes adSpin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);
  }
  overlay.style.display = "flex";
}

function hideAdLoader() {
  const overlay = document.getElementById("adLoaderOverlay");
  if (overlay) overlay.style.display = "none";
}

function setupRewardedAd(targetUrl, alwaysShowAd = false, dataFnKey, buttonId) {
  window.googletag = window.googletag || { cmd: [] };

  const adShownKey = `adShown_${buttonId}`;
  if (buttonId && sessionStorage.getItem(adShownKey)) {
    console.log(`Ad already shown for button ${buttonId}.`);
    return;
  }
  if (dataFnKey === "dailyReward") {
    const today = new Date().toISOString().split("T")[0];
    const rewardData = JSON.parse(localStorage.getItem("rewardData")) || {};
    const claims = (rewardData.date === today) ? (rewardData.claims || 0) : 0;
    if (claims >= 2) {
      showToast("Daily reward Limit reached", "error", dataFnKey);
      return;
    }
  }

  showAdLoader();
  const loaderTimeout = setTimeout(hideAdLoader, 10000);

  const rewardedSlot = googletag.defineOutOfPageSlot(
    "/23345352839/hexam_reward", // Replace with your actual ad slot ID
    googletag.enums.OutOfPageFormat.REWARDED
  );

  if (rewardedSlot) {
    rewardedSlot.addService(googletag.pubads());

    googletag.pubads().addEventListener("rewardedSlotReady", (event) => {
      clearTimeout(loaderTimeout);
      hideAdLoader();
      event.makeRewardedVisible();
      updateStatus("Rewarded ad is active.");
    });

    googletag.pubads().addEventListener("rewardedSlotClosed", () => {
      // Increment the ad shown count for daily reward

      if (rewardPayload) {
        if (dataFnKey === "dailyReward") {
          let adShownCount = parseInt(
            sessionStorage.getItem("dailyRewardAdShown") || "0",
            10
          );
          sessionStorage.setItem("dailyRewardAdShown", ++adShownCount);
        }
        if (
          ["dailyReward", "claimReward", "doubleWinning"].includes(dataFnKey)
        ) {
          giveRewardAfterAds(dataFnKey, false); // Show toast
        }
      } else if (["claimReward", "doubleWinning"].includes(dataFnKey)) {
        window.location.href =
          dataFnKey === "claimReward" ? "../quizPlay/" : "/home/";
      }
    });

    if (["dailyReward", "claimReward", "doubleWinning"].includes(dataFnKey)) {
      googletag.pubads().addEventListener("rewardedSlotGranted", (event) => {
        rewardPayload = event.payload;
        updateStatus("Reward granted.");
      });
    }

    const nonRewardKeys = ["dailyReward", "claimReward", "doubleWinning"];
    if (dataFnKey && !nonRewardKeys.includes(dataFnKey)) {
      setTimeout(() => giveRewardAfterAds(dataFnKey, false), 500); // Reward but don't show extra toast
    }

    googletag.pubads().addEventListener("slotRenderEnded", (event) => {
      if (event.slot === rewardedSlot && event.isEmpty) {
        clearTimeout(loaderTimeout);
        hideAdLoader();
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
    clearTimeout(loaderTimeout);
    hideAdLoader();
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

function showDailyRewardConfirmation(button) {
  if (document.getElementById("drModal")) return;

  const style = document.createElement("style");
  style.id = "drModalStyle";
  style.textContent = `
    #drOverlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.78);
      display: flex; align-items: center; justify-content: center;
      padding: 20px; box-sizing: border-box;
      animation: drFadeIn 0.2s ease;
    }
    @keyframes drFadeIn { from { opacity:0 } to { opacity:1 } }
    @keyframes drSlideUp { from { opacity:0; transform:translateY(30px) } to { opacity:1; transform:translateY(0) } }
    #drModal {
      background: linear-gradient(170deg, #0f172a 0%, #1a2f77 100%);
      border: 1.5px solid rgba(255,204,91,0.4);
      border-radius: 24px;
      padding: 0;
      max-width: 340px;
      width: 100%;
      text-align: center;
      position: relative;
      overflow: hidden;
      box-shadow: 0 0 80px rgba(255,204,91,0.15), 0 32px 64px rgba(0,0,0,0.7);
      animation: drSlideUp 0.28s cubic-bezier(0.34,1.56,0.64,1);
      font-family: sans-serif;
    }
    #drModal .dr-header {
      background: linear-gradient(135deg, #1a3a8f 0%, #0f2460 100%);
      padding: 28px 24px 20px;
      border-bottom: 1px solid rgba(255,204,91,0.15);
      position: relative;
    }
    #drModal .dr-close {
      position: absolute; top: 12px; right: 14px;
      background: rgba(255,255,255,0.08); border: none;
      color: #8789c3; width: 28px; height: 28px;
      border-radius: 50%; font-size: 14px;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
    }
    #drModal .dr-close:hover { background: rgba(255,255,255,0.15); color: #fff; }
    #drModal .dr-img-wrap {
      width: 80px; height: 80px;
      background: radial-gradient(circle, rgba(255,204,91,0.2) 0%, transparent 70%);
      border-radius: 50%; margin: 0 auto 12px;
      display: flex; align-items: center; justify-content: center;
    }
    #drModal .dr-img { width: 64px; height: 64px; object-fit: contain; }
    #drModal .dr-badge {
      display: inline-flex; align-items: center; gap: 5px;
      background: rgba(255,204,91,0.18);
      border: 1px solid rgba(255,204,91,0.4);
      color: #ffcc5b;
      font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
      text-transform: uppercase; border-radius: 999px;
      padding: 4px 12px; margin-bottom: 10px;
    }
    #drModal h2 {
      color: #fff; font-size: 20px; font-weight: 700;
      margin: 0 0 8px; line-height: 1.2;
    }
    #drModal .dr-coins-row {
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    #drModal .dr-coin-icon { width: 28px; height: 28px; }
    #drModal .dr-coins {
      font-size: 38px; font-weight: 900; color: #ffcc5b;
      line-height: 1;
      text-shadow: 0 0 24px rgba(255,204,91,0.6);
    }
    #drModal .dr-coins-label {
      font-size: 13px; font-weight: 600; color: rgba(255,204,91,0.7);
      letter-spacing: 1px; align-self: flex-end; padding-bottom: 5px;
    }
    #drModal .dr-body { padding: 18px 22px 22px; }
    #drModal .dr-perks {
      list-style: none; padding: 0; margin: 0 0 20px;
      text-align: left;
      background: rgba(255,255,255,0.04);
      border-radius: 14px;
      overflow: hidden;
    }
    #drModal .dr-perks li {
      display: flex; align-items: center; gap: 12px;
      font-size: 13px; color: #c5c8e8;
      padding: 10px 14px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    #drModal .dr-perks li:last-child { border-bottom: none; }
    #drModal .dr-check {
      width: 22px; height: 22px; flex-shrink: 0;
      background: rgba(255,204,91,0.18);
      border: 1px solid rgba(255,204,91,0.35);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
    }
    #drModal .dr-check svg { width: 11px; height: 11px; }
    #drModal .dr-cta {
      width: 100%;
      background: linear-gradient(135deg, #e8f41e 0%, #ffcc5b 100%);
      color: #0f172a;
      border: none; border-radius: 999px;
      padding: 15px 24px;
      font-size: 15px; font-weight: 800;
      cursor: pointer; letter-spacing: 0.4px;
      box-shadow: 0 6px 20px rgba(255,204,91,0.4);
      transition: transform 0.12s, box-shadow 0.12s;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    #drModal .dr-cta:active { transform: scale(0.97); box-shadow: 0 3px 10px rgba(255,204,91,0.3); }
    #drModal .dr-cta svg { width: 14px; height: 14px; }
    #drModal .dr-skip {
      display: block; width: 100%; margin-top: 13px;
      background: none; border: none;
      color: #6668a0; font-size: 13px;
      text-align: center;
      cursor: pointer;
      font-family: sans-serif;
      transition: color 0.15s;
    }
    #drModal .dr-skip:hover { color: #c5c8e8; }
  `;
  document.head.appendChild(style);

  const CHECK_SVG = `<svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6l3 3 5-5" stroke="#ffcc5b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const PLAY_SVG = `<svg viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 2l8 4-8 4V2z"/></svg>`;

  const overlay = document.createElement("div");
  overlay.id = "drOverlay";
  overlay.innerHTML = `
    <div id="drModal">
      <div class="dr-header">
        <button class="dr-close" id="drClose">&#10005;</button>
        <div class="dr-img-wrap">
          <img class="dr-img" src="/assets/images/gif/reward.gif" alt="Daily Reward" />
        </div>
        <div class="dr-badge">&#9733; Daily Reward</div>
        <h2>Claim Your Coins!</h2>
        <div class="dr-coins-row">
          <img class="dr-coin-icon" src="/assets/images/svg/headerCoin.svg" alt="coin" />
          <span class="dr-coins">+100</span>
          <span class="dr-coins-label">COINS</span>
        </div>
      </div>
      <div class="dr-body">
        <ul class="dr-perks">
          <li><span class="dr-check">${CHECK_SVG}</span> Watch a short ad — takes only seconds</li>
          <li><span class="dr-check">${CHECK_SVG}</span> Earn 100 free coins instantly</li>
          <li><span class="dr-check">${CHECK_SVG}</span> Claim up to 2 times per day</li>
          <li><span class="dr-check">${CHECK_SVG}</span> Use coins to enter quiz contests</li>
        </ul>
        <button class="dr-cta" id="drClaim">${PLAY_SVG} Watch Ad &amp; Claim</button>
        <button class="dr-skip" id="drSkip">No Thanks</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  function closeModal() {
    overlay.remove();
    const s = document.getElementById("drModalStyle");
    if (s) s.remove();
  }

  document.getElementById("drClose").addEventListener("click", closeModal);
  document.getElementById("drSkip").addEventListener("click", closeModal);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });

  document.getElementById("drClaim").addEventListener("click", function () {
    closeModal();
    const targetUrl = button.getAttribute("data-target");
    const alwaysShowAd = button.getAttribute("data-target") === "../quizPlay/";
    const dataFnKey = button.getAttribute("data-fn");
    const buttonId = button.getAttribute("data-button-id");
    const toast = document.querySelector(".toast");
    const progress = document.querySelector(".progress");
    if (toast) { toast.classList.remove("activeToast", "hidden", "success", "error"); }
    if (progress) { progress.classList.remove("activeToast"); }
    setupRewardedAd(targetUrl, alwaysShowAd, dataFnKey, buttonId);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".watchAdButton").forEach((button) => {
    button.onclick = () => {
      const dataFnKey = button.getAttribute("data-fn");

      if (dataFnKey === "dailyReward") {
        showDailyRewardConfirmation(button);
        return;
      }

      const targetUrl = button.getAttribute("data-target");
      const alwaysShowAd =
        button.getAttribute("data-target") === "../quizPlay/";
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
  const totalCoins = parseInt(localStorage.getItem("TotalCoin") || "0", 10);
  const totalReward = totalCoins + doubledCoins;
  localStorage.setItem("TotalCoinPerGame", doubledCoins);
  document.getElementById("coins-value").textContent = doubledCoins;
  localStorage.setItem("TotalCoin", totalReward);
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
    key === "dailyReward" ? 4000 : 1000
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
    window.location.href = "/home/";
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
