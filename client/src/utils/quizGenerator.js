// Made by Kyle (https://github.com/kt946)
/**
 * Represents a quiz generator with progress tracking and timing functionality.
 *
 * @class
 * @param {...Array} arrays - Arrays containing data for quiz generation.
 */
class QuizGenerator {
  constructor(...arrays) {
    this.selectedDataArray = this.combineAndFilterArrays(...arrays);
    this.progress = 0;
    this.numCorrect = 0;
    this.numIncorrect = 0;
    this.complete = false;
    this.startTime = new Date();
    this.endTime = null;
    this.elapsedTime = null;
  }

  /**
   * Retrieves the current progress of the quiz.
   *
   * @returns {number} - The current progress as an number from 0 to 100 with decimals.
   */
  getProgress() {
    return this.progress;
  }

  /**
   * Ends the quiz, setting completion status and calculating elapsed time.
   */
  endQuiz() {
    this.complete = true;
    this.endTime = new Date();
    // calculate elapsed time
    this.elapsedTime = (this.endTime - this.startTime) / 1000;
  }

  // combine selected data into one array and filter empty strings
  combineAndFilterArrays(...arrays) {
    const combinedArray = arrays.flat();
    return combinedArray.filter((item) => item.character !== '');
  }

  /**
   * Generates an array of answer options for a quiz question.
   * The options include the correct answer and three additional random choices.
   *
   * @param {string} correctAnswer - The correct answer for the question.
   * @param {string} answerType - The type of answer ('romaji', 'readings', 'meanings', or defaulting to 'character').
   * @returns {Array} - A shuffled array containing the correct answer and three random choices.
   */
  generateAnswerOptions(options, answerType) {
    return options.map(option => option.text);
  }

  generatecorrect(options){
    const correctOption = options.find(option => option.isCorrect);

  return correctOption;
  }

  // increment progress and check if complete
  incrementProgress() {
    this.progress += 10;
    if (this.progress >= 100) {
      this.progress = 100;
      this.endQuiz();
    }
  }

  // decrement progress
  decrementProgress() {
    this.progress -= 3;
    if (this.progress < 0) {
      this.progress = 0;
    }
  }

  // increment numCorrect
  incrementNumCorrect() {
    this.numCorrect += 1;
  }

  // increment numIncorrect
  incrementNumIncorrect() {
    this.numIncorrect += 1;
  }

  /**
   * Calculates the quiz score and XP based on the number of correct and incorrect answers.
   *
   * @returns {Object} - An object containing the calculated score and XP.
   */
  getScoreAndXP() {
    const totalQuestions = this.numCorrect + this.numIncorrect;
    const percentage = Math.round((this.numCorrect / totalQuestions) * 100);

    let score = percentage;
    let xp = Math.round((percentage / 100) * 15);

    if (score === 100) {
      xp = 15;
    }

    return { score, xp };
  }

  /**
   * Formats the elapsed time into a string representation of minutes and seconds.
   *
   * @returns {string} - A formatted string representing the elapsed time as mm:ss (e.g., "01:23").
   */
  getTime() {
    const minutes = Math.floor(this.elapsedTime / 60);
    const seconds = Math.floor(this.elapsedTime % 60);
    return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Generate question object with questionDirection, questionSubject, answer, and choices based on question type
   * @param {Object} randomQuestion - random object from selected data array, contains character, romaji, readings, and/or meanings
   * @param {string} questionType - type of question to generate
   * @returns { Object } - object with questionDirection, questionSubject, answer, and choices
   */
  getQuestion(randomQuestion, questionType) {
    // initialize variables for questionDirection, questionSubject, answer, and choices
    let questionDirection, questionSubject, answer, choices;

    // question directions
    const characterQuestion = '';
    

   
        questionDirection = characterQuestion;
        questionSubject = randomQuestion.question;
        answer = this.generatecorrect(randomQuestion.options);
        choices = this.generateAnswerOptions(randomQuestion.options, 'character');
       
    // return question object
    return { questionDirection, questionSubject, answer, choices };
  }
}

/**
 * Represents a quiz generator for Hiragana, Katakana, or Kanji questions.
 *
 * @class
 * @extends QuizGenerator
 * @param {string} type - The type of quiz ('hiragana', 'katakana', or 'kanji').
 * @param {...Array} arrays - Arrays containing data for quiz generation.
 */
class HiraKataKanjiQuiz extends QuizGenerator {
  constructor(type, ...arrays) {
    super(...arrays);
    this.quizType = type;
  }

  /**
   * Generates a question based on the selected quiz type.
   *
   * @returns {Object} - The generated question object.
   */
  generateQuestion() {
    // choose random item from selected data array to create question
    const randomQuestion = this.selectedDataArray[Math.floor(Math.random() * this.selectedDataArray.length)];

    // if quiz type is kanji, generate kanji question, else generate hiragana or katakana question
    if (this.quizType === 'kanji') {
      return this.generateKanjiQuestion(randomQuestion);
    } else if (this.quizType === 'hiragana' || this.quizType === 'katakana') {
      return this.generateHiraKataQuestion(randomQuestion);
    }
  }

  /**
   * Generates a quiz question related to Hiragana or Katakana based on the provided random question.
   *
   * @param {Object} randomQuestion - The randomly selected question object.
   * @returns {Object} - The generated question object.
   */
  generateHiraKataQuestion(randomQuestion) {
    // randomly choose between romaji and character as question subject
    if (Math.random() < 0.5) {
      return this.getQuestion(randomQuestion, 'RomajiToCharacter');
    } else {
      return this.getQuestion(randomQuestion, 'CharacterToRomaji');
    }
  }

  /**
   * Generates a quiz question related to Kanji based on the provided random question.
   *
   * @param {Object} randomQuestion - The randomly selected question object.
   * @returns {Object} - The generated question object.
   */
  generateKanjiQuestion(randomQuestion) {
    // if randomQuestion has no readings, use meanings or character for question
    // use for certain kanji that have no readings but have a special meaning such as repetition
    if (!randomQuestion.readings) {
      // randomly choose between meanings and characters for question
      if (Math.random() < 0.5) {
        return this.getQuestion(randomQuestion, 'CharacterToMeaning');
      } else {
        return this.getQuestion(randomQuestion, 'MeaningToCharacter');
      }
    }

    // Default case for kanji question
    // randomly choose between readings, meanings, and character for question
    const randomIndex = Math.floor(Math.random() * 4);

    // returns question object based on randomIndex
    switch (randomIndex) {
      case 0:
        // Select the correct reading(s) for the character
        return this.getQuestion(randomQuestion, 'CharacterToReading');
      case 1:
        // Select the correct meaning(s) for the character
        return this.getQuestion(randomQuestion, 'CharacterToMeaning');
      case 2:
        // Select the correct character for the reading(s)
        return this.getQuestion(randomQuestion, 'ReadingToOneCharacter');
      default:
        // Select the correct character for the meaning(s)
        return this.getQuestion(randomQuestion, 'MeaningToOneCharacter');
    }
  }
}

/**
 * Represents a quiz generator for vocabulary questions.
 *
 * @class
 * @extends QuizGenerator
 * @param {string} type - The type of quiz ('kanji' for kanji-related questions, default for vocabulary).
 * @param {...Array} arrays - Arrays containing data for quiz generation.
 */
class VocabQuiz extends QuizGenerator {
  constructor(type, ...arrays) {
    super(...arrays);
    this.quizType = type;
  }

  /**
   * Generates a question based on the selected quiz type.
   *
   * @returns {Object} - The generated question object.
   */
  generateQuestion() {
    // choose random item from selected data array to create question
    const randomQuestion = this.selectedDataArray[Math.floor(Math.random() * this.selectedDataArray.length)];

    // if quiz type is kanji, generate kanji question, else generate vocabulary question
    // Kanji questions have readings and characters
    if (this.quizType === 'kanji') {
      // randomly choose between readings and characters for question
      if (Math.random() < 0.5) {
        // Select the correct reading(s) for the characters
        return this.getQuestion(randomQuestion, 'CharacterToReading');
      } else {
        // Select the correct character(s) for the readings
        return this.getQuestion(randomQuestion, 'ReadingToCharacter');
      }
    } else {
      // Vocabulary questions have meanings and characters
      // randomly choose between meanings and characters for question
      if (Math.random() < 0.5) {
        // Select the correct meaning(s) for the characters
        return this.getQuestion(randomQuestion, 'CharacterToMeaning');
      } else {
        // Select the correct character(s) for the meanings
        return this.getQuestion(randomQuestion, 'MeaningToCharacter');
      }
    }
  }
}

export { HiraKataKanjiQuiz, VocabQuiz };
