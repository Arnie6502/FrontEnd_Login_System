const { createServer } = require("node:http");
const url = require("url");

const hostname = "127.0.0.1";
const port = 3000;

const server = createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Set CORS headers for frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Handle different routes
  if (path === "/" && method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World from Node.js Server!");
  } 
  else if (path === "/api" && method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "API endpoint working" }));
  }
  else if (path === "/auth/register" && method === "POST") {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ 
          message: "User registered successfully",
          username: data.username 
        }));
      } catch (error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Invalid JSON" }));
      }
    });
  }
  else if (path === "/auth/login" && method === "POST") {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ 
          message: "Login successful",
          token: "fake-jwt-token-" + Date.now(),
          username: data.username 
        }));
      } catch (error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Invalid JSON" }));
      }
    });
  }
  else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log("Available endpoints:");
  console.log("- GET  /");
  console.log("- GET  /api");
  console.log("- POST /auth/register");
  console.log("- POST /auth/login");
});

