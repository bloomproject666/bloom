/**
 * Generate embeddings for agent descriptions.
 * Uses OpenAI if OPENAI_API_KEY is present, otherwise uses a deterministic mock.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text,
          dimensions: 1536,
        }),
      })
      const data = await response.json()
      return data.data[0].embedding
    } catch (e) {
      console.error('OpenAI embedding error, falling back to mock:', e)
    }
  }

  // Deterministic mock embedding based on text content
  return mockEmbedding(text)
}

function mockEmbedding(text: string): number[] {
  const vec = new Array(1536).fill(0)
  for (let i = 0; i < text.length; i++) {
    vec[i % 1536] += text.charCodeAt(i) / 255
  }
  // Normalize
  const magnitude = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0))
  return magnitude > 0 ? vec.map(v => v / magnitude) : vec
}
