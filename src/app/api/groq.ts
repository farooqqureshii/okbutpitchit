import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { repoData, settings, theme } = await req.json();
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    return new Response(JSON.stringify({ error: 'Missing Groq API key' }), { status: 400 });
  }
  // Compose a prompt for the LLM
  const prompt = `You are a pitch deck generator. Given the following GitHub project data, generate a concise, startup-quality pitch deck in 5-7 slides.\n\nSettings: ${JSON.stringify(settings)}\nTheme: ${theme}\n\nProject Data:\n${JSON.stringify(repoData)}\n\nOutput a JSON array of slides. Each slide should have a title, main text, and (optionally) a chart, media embed, or bullet points. Be bold, legible, simple, and obvious.`;
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a world-class pitch deck generator.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });
    const data = await res.json();
    // Try to parse the slides from the LLM response
    let slides = [];
    try {
      slides = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      slides = [{ title: 'Error', text: 'Failed to parse slides from LLM.' }];
    }
    return new Response(JSON.stringify({ slides }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to call Groq API', details: String(e) }), { status: 500 });
  }
} 