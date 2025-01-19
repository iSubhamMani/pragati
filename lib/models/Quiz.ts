interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
}

export interface Quiz {
  title: string;
  questions: Question[];
}
