const http = require('http');
const { Pool } = require('pg');
const fs = require('fs'); // read HTML file
const { URLSearchParams } = require('url');  
// parse and handle form data from HTTP POST requests.

// Create a PostgreSQL database connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Lab02W',
  password: '12345',
  port: 5433,
});

async function handleRequest(request, response) {
  const url = request.url;
  const method = request.method;

  if (url === '/apply-loan') {
    fs.readFile('form.html', function (err, data) {
      if (err) {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end('Internal Server Error');
      } else {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(data);
      }
    });
  } else if (url === '/apply-loan-success' && method === 'POST') {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk.toString();
    });

    request.on('end', async () => {
      try {
        const formData = new URLSearchParams(body);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const amount = formData.get('amount');
        const purpose = formData.get('purpose');

        const insertQuery = `
          INSERT INTO debts (name, email, phone, amount, purpose, status)
          VALUES ($1, $2, $3, $4, $5, 'APPLIED')
          RETURNING id`;
        const values = [name, email, phone, amount, purpose];

        try {
          const client = await pool.connect();

          try {
            const result = await client.query(insertQuery, values);
            const ID = result.rows[0].id;
            const recap = `
              Application Form:
              Loaner ID: ${ID}
              Name: ${name}
              Email: ${email}
              Phone: ${phone}
              Amount: ${amount}
              Purpose: ${purpose}`;
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(recap);
            
          } finally {
            client.release();
          }
        } catch (error) {
          console.error('Error executing SQL query:', error);
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.end('Internal Server Error');
        }
      } catch (error) {
        console.error('Error parsing form data:', error);
        response.writeHead(400, { 'Content-Type': 'text/plain' });
        response.end('Bad Request');
      }
    });
  }
}

const server = http.createServer(handleRequest);

server.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});
