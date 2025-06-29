import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { repoData, settings, theme } = await req.json();
    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      return NextResponse.json(
        { error: 'Groq API key not configured. Please add GROQ_API_KEY to your .env file.' }, 
        { status: 500 }
      );
    }

    if (!repoData) {
      return NextResponse.json(
        { error: 'Repository data is required to generate slides.' }, 
        { status: 400 }
      );
    }

    // Enhanced prompt engineering for better slide generation
    const prompt = `You are a world-class pitch deck generator specializing in creating compelling startup presentations. Your goal is to transform GitHub repository data into a professional, investor-ready pitch deck following Y Combinator's principles.

REPOSITORY DATA:
- Name: ${repoData.repoInfo?.name || 'Unknown'}
- Description: ${repoData.repoInfo?.description || 'No description'}
- Stars: ${repoData.repoInfo?.stargazers_count || 0}
- Forks: ${repoData.repoInfo?.forks_count || 0}
- Language: ${repoData.repoInfo?.language || 'Unknown'}
- README: ${repoData.readme ? repoData.readme.substring(0, 2000) : 'No README available'}
- Contributors: ${repoData.contributors?.length || 0}
- Recent Activity: ${repoData.commits?.length || 0} recent commits

SETTINGS:
- Tone: ${settings.tone} (adjust technical vs business focus accordingly)
- Include Charts: ${settings.includeCharts}
- Theme: ${theme}

CRITICAL INSTRUCTIONS:
1. Create exactly 5-6 slides following Y Combinator's principles: Make it LEGIBLE, SIMPLE, and OBVIOUS
2. NO EMOJIS in titles or content - use clean, professional text only
3. Each slide should be immediately understandable at a glance
4. Use powerful, action-oriented language
5. Focus on business value and market opportunity

Required slide structure:
1. Title slide - Project name and one-line value proposition
2. Problem slide - What specific problem does this solve?
3. Solution slide - How does this project solve it uniquely?
4. Market/Traction slide - Evidence of demand and growth
5. Technology slide - Key technical differentiators
6. Next Steps slide - Clear roadmap and ask

Each slide must have:
- A clear, bold title (NO EMOJIS)
- Concise, impactful main text
- 2-4 bullet points maximum
- Professional business language

Generate a JSON response with this exact structure:
{
  "slides": [
    {
      "title": "Clean title without emojis",
      "text": "One powerful sentence describing the slide",
      "bullets": ["Concise bullet point", "Another key point", "Maximum 4 bullets"]
    }
  ]
}

Make this deck compelling for investors by focusing on:
- Clear problem-solution fit
- Market size and opportunity
- Technical innovation and competitive advantage
- Evidence of traction (stars, usage, community)
- Specific next steps and growth plan

Return ONLY valid JSON, no other text.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert pitch deck creator. Always respond with valid JSON containing slide data. Be concise, compelling, and investor-focused.' 
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2048,
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid Groq API key. Please check your GROQ_API_KEY in the .env file.' }, 
          { status: 401 }
        );
      }
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please wait a moment and try again.' }, 
          { status: 429 }
        );
      }
      
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Groq API');
    }

    // Parse the slides from the LLM response
    let slides = [];
    try {
      const content = data.choices[0].message.content;
      const parsed = JSON.parse(content);
      slides = parsed.slides || [];
      
      // Validate slides structure
      if (!Array.isArray(slides) || slides.length === 0) {
        throw new Error('No slides generated');
      }
      
      // Ensure each slide has required fields
      slides = slides.map((slide, index) => ({
        title: slide.title || `Slide ${index + 1}`,
        text: slide.text || '',
        bullets: Array.isArray(slide.bullets) ? slide.bullets : []
      }));
      
    } catch (parseError) {
      console.error('Failed to parse slides from LLM response:', parseError);
      // Return fallback slides based on repo data
      slides = generateFallbackSlides(repoData, settings);
    }

    return NextResponse.json({ slides });

  } catch (error: any) {
    console.error('Groq API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate slides with AI. Please check your API configuration and try again.',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}

// Fallback slide generation when AI fails
function generateFallbackSlides(repoData: any, settings: any) {
  const repoName = repoData.repoInfo?.name || 'GitHub Project';
  const description = repoData.repoInfo?.description || 'An innovative software project';
  const stars = repoData.repoInfo?.stargazers_count || 0;
  const language = repoData.repoInfo?.language || 'Unknown';
  
  return [
    {
      title: repoName,
      text: description,
      bullets: [
        'Built with modern technology stack',
        'Open source and community-driven',
        'Ready for production deployment'
      ]
    },
    {
      title: 'The Problem',
      text: 'Addressing critical challenges in the software development ecosystem',
      bullets: [
        'Current solutions lack key features',
        'Users need more efficient tools',
        'Market demand for better alternatives'
      ]
    },
    {
      title: 'Our Solution',
      text: `Leveraging ${language} to deliver superior performance and reliability`,
      bullets: [
        'Modern, scalable architecture',
        'User-centric design approach',
        'Proven development methodology'
      ]
    },
    {
      title: 'Market Traction',
      text: 'Strong community engagement and growing adoption',
      bullets: [
        `${stars} GitHub stars and growing`,
        `${repoData.contributors?.length || 0} active contributors`,
        'Continuous development and support'
      ]
    },
    {
      title: 'Next Steps',
      text: 'Strategic roadmap for scaling and market expansion',
      bullets: [
        'Feature enhancement and optimization',
        'Community growth initiatives',
        'Strategic partnerships and integrations'
      ]
    }
  ];
} 