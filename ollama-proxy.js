
// Save as ollama-proxy.js at the root of your project.
// This script uses only built-in Node.js modules, so it requires no external dependencies.
const http = require('http');

const OLLAMA_HOST = 'localhost';
const OLLAMA_PORT = 11434;
const PROXY_PORT = 3000;

const server = http.createServer((client_req, client_res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*', // Allow all origins for simplicity in a local proxy
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  // Handle CORS pre-flight requests
  if (client_req.method === 'OPTIONS') {
    client_res.writeHead(204, headers);
    client_res.end();
    return;
  }

  // Define the request options for the Ollama server
  const options = {
    hostname: OLLAMA_HOST,
    port: OLLAMA_PORT,
    path: client_req.url,
    method: client_req.method,
    headers: {
      ...client_req.headers,
      host: `${OLLAMA_HOST}:${OLLAMA_PORT}`, // Set the correct host for the Ollama server
    },
  };

  // Create a proxy request to the Ollama server
  const proxy = http.request(options, (ollama_res) => {
    // Write headers from Ollama's response to our client response
    client_res.writeHead(ollama_res.statusCode, { ...headers, ...ollama_res.headers });
    // Pipe the data from Ollama's response to our client response
    ollama_res.pipe(client_res, {
      end: true,
    });
  });

  // Handle errors on the proxy request
  proxy.on('error', (e) => {
    console.error(`[Proxy Error] Could not connect to Ollama server: ${e.message}`);
    client_res.writeHead(502, headers);
    client_res.end(JSON.stringify({
        error: 'Proxy Error: Could not connect to the Ollama server. Please ensure Ollama is running.'
    }));
  });

  // Pipe the data from our client request to the proxy request
  client_req.pipe(proxy, {
    end: true,
  });
});

// Start the proxy server
server.listen(PROXY_PORT, () => {
  console.log(`[Ollama Proxy] Started successfully.`);
  console.log(`Listening for requests from the web app on http://localhost:${PROXY_PORT}`);
  console.log(`Forwarding requests to Ollama server at http://${OLLAMA_HOST}:${OLLAMA_PORT}`);
  console.log('You can now use Ollama features in the web app. Keep this window open.');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`[FATAL] Port ${PROXY_PORT} is already in use. Please close the other program using this port.`);
    } else {
        console.error(`[FATAL] Proxy server error: ${err.message}`);
    }
    process.exit(1);
});
