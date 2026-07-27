(function () {
  var footerHTML = '<footer class="footerContainer" id="sharedFooter">' +
    '<a href="/categories/" class="categories">' +
    '<img src="/assets/images/svg/category.svg" alt="category" class="footerNavIcon" loading="lazy" />' +
    '<p>Categories</p>' +
    '</a>' +
    '<a href="/home/" class="home">' +
    '<img src="/assets/images/svg/home.svg" alt="home" class="footerNavIcon" loading="lazy" />' +
    '<p>Home</p>' +
    '</a>' +
    '<a href="/profile/" class="profile">' +
    '<img src="/assets/images/svg/profile.svg" alt="profile" class="footerNavIcon" loading="lazy" />' +
    '<p>Profile</p>' +
    '</a>' +
    '</footer>';

  document.body.insertAdjacentHTML('beforeend', footerHTML);

  document.addEventListener('DOMContentLoaded', function () {
    var path = window.location.pathname;
    var footer = document.getElementById('sharedFooter');
    if (!footer) return;
    if (path.includes('categories')) {
      footer.querySelector('.categories').classList.add('active');
    } else if (path.includes('home')) {
      footer.querySelector('.home').classList.add('active');
    } else if (path.includes('profile')) {
      footer.querySelector('.profile').classList.add('active');
    }
  });
})();
