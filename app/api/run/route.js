import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// @Desc: Export a function that creates a run using openai.beta.runs.create()
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const thread_id = searchParams.get('thread');
  const { assistants_id } = await request.json();
  console.log(thread_id, assistants_id);

  try {
    const run = openai.beta.threads.runs
      .stream(thread_id, {
        assistant_id: assistants_id,
      })
      .on('textCreated', (text) => process.stdout.write('\nassistant > '))
      .on('textDelta', (textDelta, snapshot) => process.stdout.write(textDelta.value))
      .on('toolCallCreated', (toolCall) =>
        process.stdout.write(`\nassistant > ${toolCall.type}\n\n`)
      )
      .on('toolCallDelta', (toolCallDelta, snapshot) => {
        if (toolCallDelta.type === 'code_interpreter') {
          if (toolCallDelta.code_interpreter.input) {
            process.stdout.write(toolCallDelta.code_interpreter.input);
          }
          if (toolCallDelta.code_interpreter.outputs) {
            process.stdout.write('\noutput >\n');
            toolCallDelta.code_interpreter.outputs.forEach((output) => {
              if (output.type === 'logs') {
                process.stdout.write(`\n${output.logs}\n`);
              }
            });
          }
        }
      });

    return Response.json({ message: 'Run created successfully.', data: run }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to create run.' }, { status: 500 });
  }
}
