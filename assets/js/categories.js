document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const crossIcon = document.getElementById('crossIcon');
  const container = document.getElementById('quizCategoriesContainer');

  const renderCategories = (categories) => {
    let htmlContent = "";
    categories.forEach((category) => {
      htmlContent += `
        <div class="category-item" id="${category.id}" data-name="${category.name}">
          <img class="category-image" src="${category.imagePath}" alt="${category.name}" />
          <span class="category-name">${category.name}</span>
        </div>
      `;
    });
    container.innerHTML = htmlContent;

    // Add click event listener to each category item
    document.querySelectorAll('.category-item').forEach(item => {
      item.addEventListener('click', function() {
        const categoryName = this.getAttribute('data-name');
        // Store the category name in local storage
        localStorage.setItem('selectedCategory', categoryName);
        // Navigate to the new page
        window.location.href = 'categories/quizzesForCategory';
      });
    });
  };

  // Fetch categories and set up search functionality
  fetch("../assets/json/quizCategories.json")
    .then((response) => response.json())
    .then((data) => {
      renderCategories(data);

      // Search functionality
      searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
          crossIcon.style.display = 'block';
          const filteredCategories = data.filter((category) =>
            category.name.toLowerCase().includes(searchTerm)
          );
          renderCategories(filteredCategories);
        } else {
          crossIcon.style.display = 'none';
          renderCategories(data); // Show all categories when input is cleared
        }
      });

      // Cross icon functionality
      crossIcon.addEventListener('click', function() {
        searchInput.value = '';
        crossIcon.style.display = 'none';
        searchInput.focus();
        renderCategories(data); // Show all categories when cross icon is clicked
      });
    })
    .catch((error) => console.error("Error loading categories:", error));
});