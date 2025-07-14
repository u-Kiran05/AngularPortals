const express = require('express');
const router = express.Router();
const { classifyIntent } = require('../../utils/nlpClassifier');
const { startPythonNlpServer,stopPythonNlpServer } = require('../../utils/togglePythonNlpServer');
const http = require('http');

let nlpStarted = false;

async function waitForFastAPIReady(intervalMs = 500) {
  const url = 'http://localhost:8000/health';

  return new Promise((resolve) => {
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          console.log('FastAPI NLP server is ready!');
          resolve(true);
        } else {
          setTimeout(check, intervalMs);
        }
      }).on('error', () => {
        setTimeout(check, intervalMs);
      });
    };

    check();
  });
}


async function ensureNlpRunning() {
  if (!nlpStarted) {
    console.log('Starting NLP server ...');
    startPythonNlpServer();
    try {
      await waitForFastAPIReady();
      console.log('FastAPI NLP server is ready!');
      nlpStarted = true;
    } catch (err) {
      console.error(err);
      throw new Error('FastAPI NLP server did not start in time');
    }
  }
}

router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    await ensureNlpRunning();
try {
  const { intent, confidence } = await classifyIntent(message);
  res.json({ intent, confidence });
} catch (err) {
  // NLP server might have been shutdown, try to restart and classify again
  console.warn('First NLP attempt failed, trying to restart NLP server...');

  nlpStarted = false; // Reset the flag
  await ensureNlpRunning();

  try {
    const { intent, confidence } = await classifyIntent(message);
    res.json({ intent, confidence });
  } catch (secondErr) {
    console.error('NLP Retry failed:', secondErr);
    res.status(500).json({ error: 'NLP classification failed after retry' });
  }
}

  } catch (err) {
    console.error('NLP Error:', err);
    res.status(500).json({ error: 'NLP classification failed' });
  }
});
router.post('/stop', async (req, res) => {
  try {
    await stopPythonNlpServer();
    console.log('NLP server shutdown triggered from frontend.');
    res.json({ message: 'Shutdown initiated' });
  } catch (err) {
    console.error('Shutdown failed:', err);
    res.status(500).json({ error: 'Failed to shutdown NLP server' });
  }
});
module.exports = router;
