let showAd = true;

function loadAdScript() {
    if (!window.googletag) {
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
        script.onload = initializeAd;
        document.head.appendChild(script);
    } else {
        initializeAd();
    }
}

function initializeAd() {
    window.googletag = window.googletag || { cmd: [] };
    window.googletag.cmd.push(function () {
        window.googletag.defineSlot(
            "/23201071713/quizTcz_landing_popUp",
            [[336, 280], [480, 320], [300, 250]], 'div-gpt-ad-1737541487066-0'
        ).addService(window.googletag.pubads());
        window.googletag.pubads().enableSingleRequest();
        window.googletag.pubads().setCentering(true);
        window.googletag.enableServices();
        window.googletag.display("div-gpt-ad-1737541487066-0");
    });
}

function createPopupAd() {
    if (!showAd) return;

    setTimeout(() => {
        const popupAdContainer = document.getElementById("popupAdContainer");
        popupAdContainer.innerHTML = `
    <div class="popup-ad-container">
      <div class="popup-content">
        <span class="close-popup">&times;</span>
        <div id="div-gpt-ad-1737541487066-0"></div>
      </div>
    </div>
`;

        loadAdScript();

        const closePopupButton = document.querySelector(".close-popup");
        closePopupButton.addEventListener("click", closePopup);

        showAdScript();
    }, 2000); // Wait for 1 second
}

function closePopup() {
    const popupAdContainer = document.getElementById("popupAdContainer");
    popupAdContainer.innerHTML = "";
    showAd = false;

}

function showAdScript() {
    const adSlot = document.getElementById("div-gpt-ad-1737541487066-0");
    if (adSlot) {
        initializeAd();
    }
}

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.popupOpen) {
        // Close the popup instead of navigating back
        closePopup();
    }
});
createPopupAd();