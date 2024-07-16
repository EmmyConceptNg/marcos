import OpenAI from "openai";
import User from "../models/User.js";
import Documents from "../models/Documents.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRET,
});

export const changeLanguage = async(req, res) => {

    const prompt = `translate ${req.body.letterContent} to ${req.body.language}`;

try{
        const completion = await openai.chat.completions.create({
      model: "gpt-4",
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
export const rewrite = async (req, res) => {
  const prompt = `rewrite ${req.body.letterContent} in a more ${req.body.rewrite} manner`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
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
    res.status(200).json({ letterContent: letterContent });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


export const removeDocs = async(req, res) =>{
  try {
    const user = await User.findOne({ _id: req.body.user })

    if(!user){
      res.status(404).json({error : 'could not find user'})
    }

    const removeDocs = await Documents.findOneAndDelete({ path: req.body.path });

    if(removeDocs){
      const _user = await User.findOne({ _id: req.body.user })
        .populate("subscriptionPlan")
        .populate("creditReport")
        .populate("documents")
        .populate("letters");
      res.status(200).json({ user:_user, success: "Documents removed successfully" });
    }else{
      res.status(409).json({ error: 'Could not remove file' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
