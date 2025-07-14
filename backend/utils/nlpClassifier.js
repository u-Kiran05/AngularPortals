const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


async function classifyIntent(message) {
  const res = await fetch('http://localhost:8000/classify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  if (!res.ok) throw new Error('Failed to reach local NLP server');

  const result = await res.json();
  return {
    intent: result.intent,
    confidence: result.confidence,
    all: result.all
  };
}

module.exports = { classifyIntent };
