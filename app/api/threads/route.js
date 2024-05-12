import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// @Desc: Export a function that creates a thread using openai.beta.threads.create()
export async function POST() {
  try {
    const thread = await openai.beta.threads.create();
    console.log(thread);
    return Response.json(
      { message: 'Thread created successfully.', thread: thread },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to create thread.' }, { status: 500 });
  }
}
