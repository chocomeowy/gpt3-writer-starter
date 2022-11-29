import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `Write me a Medium or Gizmodo article with the title below.

Title:`;
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`);

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}${req.body.userInput}\n`,
    temperature: 0.7,
    max_tokens: 250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  // I build Prompt #2.
  const secondPrompt = `
  Take the table of article and title of the blog post below and generate a blog post. Making it persuasive. Explain why and how.

  Title: ${req.body.userInput}

  Article: ${basePromptOutput.text}

  Blog Post:
  `;

  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.85,
    // I also increase max_tokens.
    max_tokens: 1250,
  });

  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;
