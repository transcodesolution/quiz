document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".watchAdButton").forEach((button) => {
      button.onclick = () => {
        const buttonId = button.getAttribute("data-button-id");
        const adShownKey = `adShown_${buttonId}`;
  
        // Check if the ad has already been shown for this button
        if (sessionStorage.getItem(adShownKey)) {
          console.log(`Ad already shown for button ${buttonId}.`);
          return;
        }
  
        setupRewardedAd();
  
        // Set sessionStorage flag after ad is shown for this button
        sessionStorage.setItem(adShownKey, "true");
      };
    });
  });
  
  function setupRewardedAd() {
    window.googletag = window.googletag || { cmd: [] };
  
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
      });
  
      googletag.pubads().addEventListener("slotRenderEnded", (event) => {
        if (event.slot === rewardedSlot && event.isEmpty) {
          // Fallback if no ad is returned
          updateStatus("No ad returned for rewarded ad slot.");
        }
      });
  
      // Enable Google Publisher Services and display the ad
      googletag.enableServices();
      googletag.display(rewardedSlot);
    } else {
      updateStatus("Rewarded ads are not supported on this page.");
    }
  }
  
  // Utility function to log status
  function updateStatus(message) {
    console.log("updateStatus", message);
  }
  
  // Clear sessionStorage on page reload (if the page is reloaded, ad will show again)
  const navigationEntries = performance.getEntriesByType("navigation");
  if (navigationEntries.length > 0 && navigationEntries[0].type === "reload") {
    console.log("Clearing sessionStorage after reload.");
    sessionStorage.clear();
  }


