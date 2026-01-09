# 📝 Quiz & Assessment Flow

## Stage 1: Quiz Preparation

### Load Quiz:
```javascript
GET /api/quizzes/:id

Response: {
  id, title, description,
  time_limit: 3600, // seconds
  passing_score: 80, // percentage
  max_attempts: 3,
  questions: [
    {
      id, question_text, points,
      type: 'multiple_choice',
      answers: [
        {id, answer_text, is_correct: false}
      ]
    }
  ]
}
```

### Check Prerequisites:
- Đã complete required content?
- Còn attempts?
- Enrolled in course?

## Stage 2: Taking Quiz

### Timer:
```javascript
let remainingTime = quiz.time_limit;
const timer = setInterval(() => {
  remainingTime--;
  updateTimerDisplay(remainingTime);
  
  if (remainingTime === 0) {
    autoSubmitQuiz();
  }
}, 1000);
```

### Answer Tracking:
```javascript
const userAnswers = {};

function selectAnswer(questionId, answerId) {
  userAnswers[questionId] = answerId;
  saveToLocalStorage(); // Backup
}
```

## Stage 3: Submission
```javascript
POST /api/quizzes/:id/submit

Body: {
  quiz_id,
  answers: [
    {question_id: 1, answer_ids: [3]},
    {question_id: 2, answer_ids: [1, 4]} // Multiple
  ],
  time_taken: 1453,
  started_at, submitted_at
}
```

## Stage 4: Auto-Grading Algorithm

```javascript
function gradeQuiz(quiz, userAnswers) {
  let totalScore = 0;
  const results = [];
  
  quiz.questions.forEach(question => {
    const userAnswer = userAnswers.find(a => a.question_id === question.id);
    const correctAnswers = question.answers.filter(a => a.is_correct);
    
    let isCorrect = false;
    let pointsEarned = 0;
    
    if (question.type === 'multiple_choice_single') {
      // Exact match
      isCorrect = userAnswer.answer_ids[0] === correctAnswers[0].id;
      pointsEarned = isCorrect ? question.points : 0;
    }
    else if (question.type === 'multiple_choice_multiple') {
      // All correct selected, no wrong selected
      const userSet = new Set(userAnswer.answer_ids);
      const correctSet = new Set(correctAnswers.map(a => a.id));
      
      isCorrect = setsEqual(userSet, correctSet);
      pointsEarned = isCorrect ? question.points : 0;
    }
    
    results.push({
      question_id: question.id,
      is_correct: isCorrect,
      points_earned: pointsEarned,
      correct_answer_ids: correctAnswers.map(a => a.id)
    });
    
    totalScore += pointsEarned;
  });
  
  const maxScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);
  const percentage = (totalScore / maxScore) * 100;
  const passed = percentage >= quiz.passing_score;
  
  return {totalScore, maxScore, percentage, passed, results};
}
```

## Stage 5: Save Results

```sql
-- Quiz attempt record
INSERT INTO quiz_attempt (
  user_id, quiz_id, score, percentage, 
  status, time_taken, attempt_number
) VALUES (?, ?, ?, ?, ?, ?, ?);

-- Individual answers
INSERT INTO user_answer (
  user_id, question_id, selected_answer_ids, 
  is_correct, points_earned
) VALUES (?, ?, ?, ?, ?);

-- Update progress
UPDATE progress 
SET completed = ?, score = ?
WHERE user_id = ? AND content_id = ?;
```

## Stage 6: Results Display

### UI Components:
```
┌─────────────────────────────┐
│   Quiz Results              │
│                             │
│   🎯 Score: 85/100 (85%)   │
│   ✅ PASSED                 │
│                             │
│   ⏱️  Time: 24:13          │
│   🔄 Attempt: 1/3          │
└─────────────────────────────┘

Question-by-Question Review:
✅ Q1: Your answer: B (Correct)
❌ Q2: Your answer: A (Wrong - Correct: C)
   Explanation: ...
✅ Q3: Your answer: C (Correct)
```

## Achievements
- 🏆 First Quiz Passed
- 💯 Perfect Score (100%)
- ⚡ Speed Demon (< 50% time)
- 📚 Quiz Master (all quizzes passed)
