const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
function startPythonNlpServer() {
  const pythonPath = path.join(__dirname, '../.venv/Scripts/python.exe'); 
  const appPath = path.join(__dirname, '../app.py');                      

  const subprocess = spawn(
    pythonPath,
    ['-m', 'uvicorn', 'app:app', '--host', '127.0.0.1', '--port', '8000'],
    {
      cwd: path.join(__dirname, '..'), 
      stdio: 'inherit',
      shell: true
    }
  );
  subprocess.on('error', (err) => {
    console.error('Failed to start Python NLP server:', err);
  });

  subprocess.on('exit', (code) => {
    console.log(`ℹPython NLP server exited with code ${code}`);
  });
}

function stopPythonNlpServer() {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 8000,
        path: '/shutdown',
        method: 'POST'
      },
      (res) => {
        resolve(true); // resolve even without waiting for body
      }
    );

    req.on('error', (err) => {
      if (err.code === 'ECONNRESET') {
        console.log('NLP server forcefully closed the connection — expected on shutdown.');
        resolve(true);
      } else {
        reject(err);
      }
    });

    req.end();
  });
}

module.exports = { startPythonNlpServer ,stopPythonNlpServer};
