import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRET,
});

export const changeLanguage = async(req, res) => {

    const prompt = `translate ${req.body.letterContent} to ${req.body.language}`;

try{
        const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1024,
    });

    // Log the entire completion object to inspect its structure
    console.log(`Received completion:`, completion.choices[0].message.content);

    // Assuming the response structure matches the documentation:
    const letterContent = completion.choices[0].message.content.trim();
    res.status(200).json({letterContent: letterContent});
}catch(e){
    res.status(500).json({ error: e.message });

}


};
