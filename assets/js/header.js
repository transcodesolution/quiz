(function () {
  var headerHTML = '<header class="headerContainer">' +
    '<button class="menuToggle" id="menuToggle" aria-label="Open menu">' +
    '<span></span><span></span><span></span>' +
    '</button>' +
    '<a href="/home/" class="logo">' +
    '<img src="/assets/images/svg/logo.svg" alt="logo" class="logo-image" loading="lazy" />' +
    '</a>' +
    '<a href="/profile/" class="totalCoins">' +
    '<img src="/assets/images/svg/headerCoin.svg" alt="coin" class="coin-image" loading="lazy" />' +
    '<p id="totalCoinsDisplay">0 <span>COINS</span></p>' +
    '</a>' +
    '</header>';

  var drawerHTML = '<div class="menuOverlay" id="menuOverlay"></div>' +
    '<div class="menuDrawer" id="menuDrawer">' +
    '<button class="drawerClose" id="drawerClose" aria-label="Close menu">&#10005;</button>' +
    '<div class="drawerProfile">' +
    '<div class="drawerAvatar">GU</div>' +
    '<p class="drawerUsername">Guest User</p>' +
    '</div>' +
    '<nav class="drawerNav">' +
    '<button class="drawerNavItem drawerDailyReward watchAdButton" id="drawerDailyReward" data-fn="dailyReward">' +
    '<img src="/assets/images/gif/reward.gif" class="drawerNavIcon" style="width:20px;height:20px;object-fit:contain;" alt="reward" />' +
    'Daily Reward' +
    '</button>' +
    '<a href="/home/" class="drawerNavItem">' +
    '<svg class="drawerNavIcon" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>' +
    'Home' +
    '</a>' +
    '<a href="/categories/" class="drawerNavItem">' +
    '<svg class="drawerNavIcon" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 12h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 18h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/></svg>' +
    'Categories' +
    '</a>' +
    '<a href="/contest-rules/" class="drawerNavItem">' +
    '<svg class="drawerNavIcon" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8zm0-4h8v2H8zm0-4h5v2H8z"/></svg>' +
    'Contest Rules' +
    '</a>' +
    '<a href="/privacy-policy/" class="drawerNavItem">' +
    '<svg class="drawerNavIcon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z"/></svg>' +
    'Privacy Policy' +
    '</a>' +
    '<a href="/terms-of-use/" class="drawerNavItem">' +
    '<svg class="drawerNavIcon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>' +
    'Terms of Use' +
    '</a>' +
    '<a href="/cookie-policy/" class="drawerNavItem">' +
    '<svg class="drawerNavIcon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-.34-.02-.67-.05-1A3.5 3.5 0 0 1 17.5 7a3.5 3.5 0 0 1-3-5.29A9.97 9.97 0 0 0 12 2zm-1 13a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-4-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5-5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>' +
    'Cookie Policy' +
    '</a>' +
    '</nav>' +
    '</div>';

  document.body.insertAdjacentHTML('afterbegin', headerHTML + drawerHTML);

  var menuToggle = document.getElementById('menuToggle');
  var menuDrawer = document.getElementById('menuDrawer');
  var menuOverlay = document.getElementById('menuOverlay');
  var drawerClose = document.getElementById('drawerClose');

  function openMenu() {
    menuDrawer.classList.add('open');
    menuOverlay.classList.add('open');
  }
  function closeMenu() {
    menuDrawer.classList.remove('open');
    menuOverlay.classList.remove('open');
  }

  menuToggle.addEventListener('click', openMenu);
  menuOverlay.addEventListener('click', closeMenu);
  drawerClose.addEventListener('click', closeMenu);
  document.getElementById('drawerDailyReward').addEventListener('click', closeMenu);

  document.addEventListener('DOMContentLoaded', function () {
    var coins = localStorage.getItem('TotalCoin') || 0;
    var el = document.getElementById('totalCoinsDisplay');
    if (el) el.innerHTML = coins + ' <span>COINS</span>';
  });
})();
