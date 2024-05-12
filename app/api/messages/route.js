import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// @Desc: Export a function that creates a message using openai.beta.messages.create()
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const thread_id = searchParams.get('thread');
  const { chat } = await request.json();
  console.log(thread_id);

  try {
    const message = await openai.beta.threads.messages.create(thread_id, {
      role: 'user',
      content: chat,
    });
    console.log(message);

    return Response.json(
      { message: 'Message created successfully.', data: message },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to create message.' }, { status: 500 });
  }
}
