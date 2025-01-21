document.addEventListener("DOMContentLoaded", function () {
  const categorySlider = document.getElementById("categorySlider");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const quizzesContainer = document.getElementById("quizzesContainer");
  let currentSelectedCategory = null;

  fetch("../assets/json/quizCategories.json")
    .then((response) => response.json())
    .then((categories) => {
      const allCategoryDiv = document.createElement("div");
      allCategoryDiv.className = "category-item";
      allCategoryDiv.textContent = "All";
      allCategoryDiv.onclick = () =>
        updateQuizzes("All", allCategoryDiv, categories);
      categorySlider.appendChild(allCategoryDiv);

      categories.forEach((category) => {
        const categoryDiv = document.createElement("div");
        categoryDiv.className = "category-item";
        categoryDiv.textContent = category.name;
        categoryDiv.onclick = () =>
          updateQuizzes(category.name, categoryDiv, categories);
        categorySlider.appendChild(categoryDiv);
      });

      // Initially load all quizzes
      updateQuizzes("All", allCategoryDiv, categories);
    })
    .catch((error) => console.error("Error loading categories:", error));

  prevBtn.addEventListener("click", () => {
    categorySlider.scrollBy({ left: -200, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    categorySlider.scrollBy({ left: 200, behavior: "smooth" });
  });

  function updateQuizzes(categoryName, selectedDiv, categories) {
    let fetchPromises = [];

    if (categoryName === "All") {
      categories.forEach((category) => {
        fetchPromises.push(
          fetch(category.path).then((res) => res.json().then((quizzes) => ({
            quizzes,
            path: category.path
          })))
        );
      });

      Promise.all(fetchPromises)
        .then((allQuizzesData) => {
          let quizzes = allQuizzesData.flatMap(data => data.quizzes.map(quiz => ({
            ...quiz,
            path: data.path
          })));
          renderQuizzes(quizzes, categoryName, selectedDiv);
        })
        .catch((error) => console.error("Error loading quizzes:", error));
    } else {
      const category = categories.find((cat) => cat.name === categoryName);
      if (category) {
        fetch(category.path)
          .then((response) => response.json())
          .then((quizzes) => {
            renderQuizzes(quizzes, categoryName, selectedDiv, category.path);
          })
          .catch((error) => console.error("Error loading quizzes:", error));
      }
    }
  }

  function renderQuizzes(quizzes, categoryName, selectedDiv, quizPath) {
    let htmlContent = ``;
    quizzes.forEach((quiz) => {
      let path = categoryName === "All" ? quiz.path : quizPath;
      htmlContent += `
        <div class="outerContainer">
          <a href='home/quizPlay' class="innerContainer" onclick="event.preventDefault(); storeQuizData('${categoryName}', '${quiz.title}', '${quiz.imagePath}', '${quiz.totalPrice}', '${quiz.entryFee}','${path}')">
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
  }
});

// Define storeQuizData in the global scope
function storeQuizData(
  categoryName,
  quizTitle,
  quizImage,
  totalPrice,
  entryFee,
  quizPath
) {
  localStorage.setItem(
    "selectedQuiz",
    JSON.stringify({
      categoryName: categoryName,
      quizTitle: quizTitle,
      quizImage: quizImage,
      totalPrice: totalPrice,
      entryFee: entryFee,
    })
  );
  localStorage.setItem("selectedCategoryPath", quizPath);
  window.location.href = "home/quizPlay/";
 }