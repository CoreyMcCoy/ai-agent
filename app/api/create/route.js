import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Create a simple GET route that returns a JSON response
export async function POST(request) {
  const { name, instructions } = await request.json();
  try {
    const assistant = await openai.beta.assistants.create({
      name: name,
      instructions: instructions,
      tools: [
        {
          type: 'code_interpreter',
        },
      ],
      model: 'gpt-4-turbo',
    });
    console.log(assistant);
    return Response.json(
      { message: 'Beep Bop Boop...agent created successfully.', assistant },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to create agent.' }, { status: 500 });
  }
}
