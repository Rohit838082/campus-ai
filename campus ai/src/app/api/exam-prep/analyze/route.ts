import { NextResponse } from "next/server";

export const maxDuration = 60; // Allow 60 seconds for long file processing

export async function POST(request: Request) {
  try {
    const { files } = await request.json();
    
    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }

    // Prepare files for Gemini API
    const parts: any[] = files.map((file: any) => {
      let mimeType = file.type;
      
      // If no type provided, or unsupported generic binary, try to guess
      if (!mimeType || mimeType === "application/octet-stream" || mimeType === "unknown") {
        if (file.name.endsWith(".pdf")) mimeType = "application/pdf";
        else if (file.name.endsWith(".html")) mimeType = "text/html";
        else if (file.name.endsWith(".csv")) mimeType = "text/csv";
        else mimeType = "text/plain"; // Safe fallback for most readable files
      }

      // Gemini doesn't support docx natively via inlineData text extraction as easily as PDF/TXT.
      // If it's docx, we'll send it as text/plain and hope it extracts strings, or the frontend should parse it.
      // Since we just have base64, we will try text/plain.
      if (mimeType.includes("wordprocessingml") || mimeType.includes("msword")) {
        mimeType = "text/plain"; 
      }

      return {
        inlineData: {
          mimeType,
          data: file.base64,
        }
      };
    });

    // Add instructions to prompt
    parts.push({
      text: `Analyze the provided exam documents (Previous Year Question papers and Notes).
      1. Extract all meaningful exam questions from the documents.
      2. Identify repeated questions and patterns to determine frequency.
      3. Categorize each question's priority:
         - "High": Highly frequent and core concepts.
         - "Medium": Asked occasionally, secondary concepts.
         - "Low": Rarely asked or very specific edge cases.
      4. For each extracted question, use the Google Search tool to find a concise, accurate, and professional model answer.
      5. Return a structured JSON response EXACTLY matching this format, with no other text:
      {
        "questions": [
          {
            "id": "q1",
            "topic": "Topic Name",
            "question": "The actual question text...",
            "priority": "High",
            "frequency": 3,
            "completed": false,
            "modelAnswer": "The precise answer sourced from the internet..."
          }
        ]
      }
      Ensure the output is strictly valid JSON.`
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          tools: [{ googleSearch: {} }],
          generationConfig: {
            temperature: 0.2, // Low temp for extraction consistency
          }
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API Error:", err);
      return NextResponse.json({ error: "Failed to analyze documents", details: err }, { status: 500 });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      return NextResponse.json({ error: "No analysis generated" }, { status: 500 });
    }

    // Clean markdown formatting if Gemini included it
    const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse Gemini output:", cleanedText);
      return NextResponse.json({ error: "Invalid response format from AI" }, { status: 500 });
    }

    // Fix IDs to be unique
    if (parsedResult.questions && Array.isArray(parsedResult.questions)) {
      parsedResult.questions = parsedResult.questions.map((q: any) => ({
        ...q,
        id: Math.random().toString(36).substr(2, 9)
      }));
    }

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error("Error analyzing exam prep:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
