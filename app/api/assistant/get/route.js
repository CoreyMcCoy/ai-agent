import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// @Desc: Export a function that returns all the assistants using openai.beta.assistants.list()
export async function GET() {
  try {
    const myAssistants = await openai.beta.assistants.list({
      order: 'desc',
      limit: 3,
    });
    return Response.json(
      { message: 'Here are the last 3 assistants.', assistants: myAssistants.data },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to fetch agents.' }, { status: 500 });
  }
}
