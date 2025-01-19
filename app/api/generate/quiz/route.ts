import { handleError } from "@/utils/handleError";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const courseTitle = formData.get("courseTitle") as string;
    const videoSectionTitles = formData.get("videoSectionTitles");

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    const prompt = `
          
          Please generate a quiz (10 questions) based on the course which has the title: ${courseTitle} and has the following sections: ${videoSectionTitles}. The output should be structured as given in the example.
    
          **Example:**
          
          {
            title: Title of the Quiz,
            questions: [
              {
                "id": 1,
                "question": "Question 1",
                "answers": [
                  "Answer 1",
                  "Answer 2",
                  "Answer 3"
                ],
                "correctAnswer": 0
              },
              {
                "id": 2,
                "question": "Question 2",
                "answers": [
                  "Answer 1",
                  "Answer 2",
                  "Answer 3"
                ],
                "correctAnswer": 1
              }
            ]
          }
          
          **End of Example**
    
          The correctAnswer is the index of the correct answer in the answers array. Increase the difficulty of the quiz if necessary with each question.
    
          `;

    const result = await model.generateContent(prompt);

    if (result.response.text().length > 0) {
      return NextResponse.json({
        data: result.response.text().replace(/```json\s*|\s*```/g, ""),
        success: true,
      });
    }

    return NextResponse.json(
      {
        data: null,
        success: false,
      },
      { status: 400 }
    );
  } catch (error) {
    handleError(error as Error);
  }
}
