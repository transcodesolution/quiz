function setupRewardedAd(targetUrl) {
  window.googletag = window.googletag || { cmd: [] };

  // Define the rewarded ad slot
  const rewardedSlot = googletag.defineOutOfPageSlot(
    "/23201071713/tcz_reward_landingPage_OnbuttonClick", // Replace with your actual ad slot ID
    googletag.enums.OutOfPageFormat.REWARDED
  );

  if (rewardedSlot) {
    rewardedSlot.addService(googletag.pubads());

    googletag.pubads().addEventListener("rewardedSlotReady", (event) => {
      // Make the ad visible and ready
      event.makeRewardedVisible();
      updateStatus("Rewarded ad is active.");

      // Event listener for when the ad is closed
      googletag.pubads().addEventListener("rewardedSlotClosed", () => {
        if (rewardPayload) {
          window.location.href = targetUrl;
        }
      });
    });
    googletag.pubads().addEventListener("rewardedSlotGranted", (event) => {
      rewardPayload = event.payload;
      updateStatus("Reward granted.");
    });

    googletag.pubads().addEventListener("slotRenderEnded", (event) => {
      if (event.slot === rewardedSlot && event.isEmpty) {
        // Fallback if no ad is returned
        updateStatus("No ad returned for rewarded ad slot.");
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
      setupRewardedAd(targetUrl);
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
