googletag.cmd.push(function () {
  googletag
    .defineSlot(
      "/23201071713/quizTcz_top",
      [
        [300, 250],
        [336, 280],
      ],
      "div-gpt-ad-1738056273528-0"
    )
    .addService(googletag.pubads());

  googletag.pubads().collapseEmptyDivs();
  googletag.enableServices();

  // Add event listener to handle ad loading
  googletag.pubads().addEventListener('slotRenderEnded', function(event) {
    if (event.slot.getSlotElementId() === 'div-gpt-ad-1738056273528-0') {
      if (!event.isEmpty) {
        // Ad has loaded, remove the default size
        document.getElementById('div-gpt-ad-1738056273528-0').style.minHeight = 'auto';
        document.getElementById('div-gpt-ad-1738056273528-0').style.minWidth = 'auto';
      } else {
        // Ad failed to load, remove the ad container
        document.getElementById('div-gpt-ad-1738056273528-0').remove();
      }
    }
  });
});
 