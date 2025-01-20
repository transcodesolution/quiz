document.addEventListener("DOMContentLoaded", function () {
  const categorySlider = document.getElementById("categorySlider");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const quizzesContainer = document.getElementById("quizzesContainer");
  let currentSelectedCategory = null;

  fetch("../assets/json/quizCategories.json")
    .then((response) => response.json())
    .then((data) => {
      const allCategoryDiv = document.createElement("div");
      allCategoryDiv.className = "category-item";
      allCategoryDiv.textContent = "All";
      allCategoryDiv.onclick = () => updateQuizzes("All", allCategoryDiv);
      categorySlider.appendChild(allCategoryDiv);

      data.forEach((category) => {
        const categoryDiv = document.createElement("div");
        categoryDiv.className = "category-item";
        categoryDiv.textContent = category.name;
        categoryDiv.onclick = () => updateQuizzes(category.name, categoryDiv);
        categorySlider.appendChild(categoryDiv);
      });

      // Initially load all quizzes
      updateQuizzes("All", allCategoryDiv);
    })
    .catch((error) => console.error("Error loading categories:", error));

  prevBtn.addEventListener("click", () => {
    categorySlider.scrollBy({ left: -200, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    categorySlider.scrollBy({ left: 200, behavior: "smooth" });
  });

  function updateQuizzes(categoryName, selectedDiv) {
    fetch("../assets/json/quizzesForCategory.json")
      .then((response) => response.json())
      .then((data) => {
        let quizzes = [];
        if (categoryName === "All") {
          // Collect all quizzes from all categories
          for (let key in data) {
            quizzes = quizzes.concat(data[key]);
          }
        } else {
          quizzes = data[categoryName] || [];
        }

        let htmlContent = ``;
        quizzes.forEach((quiz) => {
          htmlContent += `
              <div class="outerContainer">
                 <a href="categories/quizzesForCategory/quizPlay" class="innerContainer" onclick="storeQuizData('${categoryName}', '${quiz.title}', '${quiz.imagePath}', '${quiz.totalPrice}','${quiz.entryFee}')">
                   <img src="${quiz.imagePath}" alt="${quiz.title}" />
                <div class='quizDetails'>
                  <div class='quizTitleContainer'>
                    <p>${quiz.title}</p>
                    </div>
                     <div class='quizPriceContainer'>
                      <p>Play & Win &nbsp;</p>
                      <img src="../../assets/images/svg/coin.svg" alt="coin" />
                      <p>&nbsp;${quiz.totalPrice}</p>
                      </div>
                       <div class='priceContainer'>
                      <p>Entry Fee &nbsp;</p>
                      <img src="../../assets/images/svg/coin.svg" alt="coin" />
                      <p>&nbsp;${quiz.entryFee}</p>
                      </div>
                </div>
                <img src="../../assets/images/svg/playIcon.svg" alt="play" />
                </a>
                </div>
            `;
        });
        quizzesContainer.innerHTML = htmlContent;

        // Update selected category background
        if (currentSelectedCategory) {
          currentSelectedCategory.style.backgroundColor = "";
        }
        selectedDiv.style.backgroundColor = "#1a2f77";
        currentSelectedCategory = selectedDiv;
      })
      .catch((error) => console.error("Error loading quizzes:", error));
  }
});
