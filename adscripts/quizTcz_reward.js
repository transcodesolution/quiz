function setupRewardedAd(targetUrl, alwaysShowAd = false) {
  window.googletag = window.googletag || { cmd: [] };

  // If "alwaysShowAd" is true, we will always show the ad, ignoring sessionStorage
  if (sessionStorage.getItem("adShown") && !alwaysShowAd) {
    // Redirect directly to the target URL if the ad was shown previously
    window.location.href = targetUrl;
    return;
  }

  // Define the rewarded ad slot
  const rewardedSlot = googletag.defineOutOfPageSlot(
    "/23201071713/quizTcz_reward", // Replace with your actual ad slot ID
    googletag.enums.OutOfPageFormat.REWARDED
  );

  if (rewardedSlot) {
    rewardedSlot.addService(googletag.pubads());

    googletag.pubads().addEventListener("rewardedSlotReady", (event) => {
      // Make the ad visible and ready
      event.makeRewardedVisible();
      updateStatus("Rewarded ad is active.");

      // Event listener for when the ad is closed
      googletag.pubads().addEventListener(
        "rewardedSlotClosed",
        () => {
          // If it's not the "Play Now" button, set sessionStorage flag after ad closes
          if (!alwaysShowAd) {
            sessionStorage.setItem("adShown", "true");
          }

          // Conditional check to call watchAdd
          if (targetUrl === "quizPlay/quiz") {
            watchAdd();
          }
          window.location.href = targetUrl; // Navigate to the target URL after the ad
        },
        { once: true }
      );
    });

    googletag.pubads().addEventListener("slotRenderEnded", (event) => {
      if (event.slot === rewardedSlot && event.isEmpty) {
        // Fallback if no ad is returned
        updateStatus("No ad returned for rewarded ad slot.");
        // Conditional check to call watchAdd
        if (targetUrl === "quizPlay/quiz") {
          watchAdd();
        }
        window.location.href = targetUrl; // Navigate without the ad
      }
    });

    // Enable Google Publisher Services and display the ad
    googletag.enableServices();
    googletag.display(rewardedSlot);
  } else {
    updateStatus("Rewarded ads are not supported on this page.");
    window.location.href = targetUrl; // Fallback to navigate directly if ads aren't supported
  }
}

// Setup button event listeners after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".watchAdButton").forEach((button) => {
    button.onclick = () => {
      const targetUrl = button.getAttribute("data-target");

      // Check if the button is the "Play Now" button, in which case we force ad display every time
      const alwaysShowAd =
        button.getAttribute("data-target") === "../quizPlay/" ||
        button.getAttribute("data-target") === "quizPlay/quiz";

      setupRewardedAd(targetUrl, alwaysShowAd);
    };
  });
});

// Utility function to log status
function updateStatus(message) {
  console.log("updateStatus", message);
}

// Clear sessionStorage on page reload (if the page is reloaded, ad will show again)
const navigationEntries = performance.getEntriesByType("navigation");
if (navigationEntries.length > 0 && navigationEntries[0].type === "reload") {
  console.log("Clearing sessionStorage after reload.");
  sessionStorage.removeItem("adShown");
}
