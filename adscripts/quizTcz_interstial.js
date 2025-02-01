window.googletag = window.googletag || { cmd: [] };

let interstitialSlot;

googletag.cmd.push(() => {
  // Define a web interstitial ad slot.
  interstitialSlot = googletag.defineOutOfPageSlot(
    "/23201071713/quizTcz_interstial",
    googletag.enums.OutOfPageFormat.INTERSTITIAL,
  );

  // Slot returns null if the page or device does not support interstitials.
  if (interstitialSlot) {

    // Enable optional interstitial triggers and register the slot.
    interstitialSlot.addService(googletag.pubads()).setConfig({
      interstitial: {
        triggers: {
          navBar: true,
          unhideWindow: true,
        },
      },
    });

  }
  // Enable SRA and services.
  googletag.pubads().enableSingleRequest();
  googletag.pubads().collapseEmptyDivs();
  googletag.enableServices();
});