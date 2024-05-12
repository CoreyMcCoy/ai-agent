import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// @Desc: Export a function that creates an assistant using openai.beta.assistants.create()
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
      { message: 'Beep Bop Boop...agent created successfully.', assistant: assistant },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to create agent.' }, { status: 500 });
  }
}

// @Desc: Export a function that returns a single assistant using openai.beta.assistants.retrieve()
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  try {
    const assistant = await openai.beta.assistants.retrieve(id);
    return Response.json(
      { message: `${assistant.name} found.`, assistant: assistant },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to fetch agent.' }, { status: 500 });
  }
}
