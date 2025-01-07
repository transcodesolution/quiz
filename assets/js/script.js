class Quiz {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.timeLeft = 60;
        this.timer = null;
        
        // DOM Elements
        this.questionEl = document.getElementById('question');
        this.optionsContainer = document.getElementById('options');
        this.nextBtn = document.getElementById('next-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.submitBtn = document.getElementById('submit-btn');
        this.timerEl = document.getElementById('time');
        this.progressEl = document.getElementById('progress');
        this.resultContainer = document.getElementById('result-container');
        this.scoreEl = document.getElementById('score');
        this.restartBtn = document.getElementById('restart-btn');
        
        // Event Listeners
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.submitBtn.addEventListener('click', () => this.submitQuiz());
        this.restartBtn.addEventListener('click', () => this.restartQuiz());
        
        // Initialize quiz
        this.startQuiz();
    }
    
    startQuiz() {
        this.loadQuestion();
        this.startTimer();
    }
    
    loadQuestion() {
        // Update progress bar
        this.updateProgress();
        
        // Load question and options (dummy data for example)
        this.questionEl.textContent = `Sample Question ${this.currentQuestion + 1}`;
        
        // Update navigation buttons
        this.prevBtn.style.display = this.currentQuestion === 0 ? 'none' : 'block';
        this.nextBtn.style.display = this.currentQuestion === 9 ? 'none' : 'block';
        this.submitBtn.style.display = this.currentQuestion === 9 ? 'block' : 'none';
    }
    
    nextQuestion() {
        if (this.currentQuestion < 9) {
            this.currentQuestion++;
            this.loadQuestion();
        }
    }
    
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.loadQuestion();
        }
    }
    
    updateProgress() {
        const progress = ((this.currentQuestion + 1) / 10) * 100;
        this.progressEl.style.width = `${progress}%`;
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timerEl.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.submitQuiz();
            }
        }, 1000);
    }
    
    submitQuiz() {
        clearInterval(this.timer);
        document.querySelector('.quiz-container').style.display = 'none';
        this.resultContainer.classList.remove('hide');
        
        // Calculate and display score (dummy calculation)
        this.score = Math.floor(Math.random() * 100);
        this.scoreEl.textContent = this.score;
    }
    
    restartQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.timeLeft = 60;
        this.timerEl.textContent = this.timeLeft;
        
        document.querySelector('.quiz-container').style.display = 'block';
        this.resultContainer.classList.add('hide');
        
        this.loadQuestion();
        this.startTimer();
    }
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
}); 