import http, { IncomingMessage, ServerResponse } from 'node:http';
import fs from 'node:fs/promises';

async function handleRequest(request: IncomingMessage, response: ServerResponse) {
  const url = request.url;
  const method = request.method;

  console.log('Debugging -- url is', url, 'while method is', method);

  if (url === '/apply-loan') {
    try {
      // Read the HTML file contents
      const contents = await fs.readFile('apply-loan.html', 'utf-8');
      response
        .writeHead(200, { 'Content-Type': 'text/html' }) // Tell the browser that you're sending HTML
        .end(contents);
    } catch (error) {
      console.error('Error reading HTML file:', error);
      response.writeHead(500);
      response.end('Internal Server Error');
    }
  } else {
    response
      .writeHead(200)
      .end('You sent me:' + url);
  }
}

const server = http.createServer(handleRequest);

server.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});
