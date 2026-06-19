import express from 'express'

import users from './routes/users.js'
import posts from './routes/posts.js'

import error from './utilities/error.js'

// Part 2: Adding Additional Routes - Importing comments

import comments from "./routes/comments.js"

/* Part 1 - Exploring Existig Routes
Took a good amount of time studying the code.
Reached out to QS regarding the portion of lesson/lab missed to see if they used ReqBin to test routes like the lesson stated.
Advised on using Thunderclient or PostMan, both of which I have heard form videos.
Tested routes using Thunderclient:
5:13:17 PM: Received a GET request to /api/users?api-key=perscholas.
-----
5:15:52 PM: Received a GET request to /api/posts?api-key=perscholas.
-----
5:16:30 PM: Received a GET request to /api/users/1?api-key=perscholas.
*/

/* Part 3: Testing - Test your routes!
Server listening on port: 3000.
-----
10:35:55 PM: Received a GET request to /api/comments?api-key=perscholas.
-----
10:37:15 PM: Received a POST request to /api/comments?api-key=perscholas.
-----
10:38:47 PM: Received a POST request to /api/comments?api-key=perscholas.
Containing the data:
{"userId":1,"postId":1,"body":"This is my first comment!"}
-----
10:40:55 PM: Received a GET request to /api/comments/1?api-key=perscholas.
Containing the data:
{"userId":1,"postId":1,"body":"This is my first comment!"}
-----
10:42:01 PM: Received a PATCH request to /api/comments/1?api-key=perscholas.
Containing the data:
{"body":"I updated my comment!"}
-----
10:42:47 PM: Received a DELETE request to /api/comments/1?api-key=perscholas.
Containing the data:
{"body":"I updated my comment!"}
-----
10:43:04 PM: Received a DELETE request to /api/comments/1?api-key=perscholas.
Containing the data:
{"body":"I updated my comment!"}
*/

const app = express();
const port = 3000;

// Parsing Middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Logging Middlewaare
app.use((req, res, next) => {
  const time = new Date();

  console.log(
    `-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
  );
  if (Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

// Valid API Keys.
const apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];

// New middleware to check for API keys!
// Note that if the key is not verified,
// we do not call next(); this is the end.
// This is why we attached the /api/ prefix
// to our routing at the beginning!
app.use("/api", function (req, res, next) {
  var key = req.query["api-key"];

  // Check for the absence of a key.
  if (!key) next(error(400, "API Key Required"));

  // Check for key validity.
  if (apiKeys.indexOf(key) === -1) next(error(401, "Invalid API Key"));

  // Valid key! Store it in req.key for route access.
  req.key = key;
  next();
});

// Use our Routes
app.use("/api/users", users);
app.use("/api/posts", posts);

// Part 2: Adding Additional Routes - Using Comments Route

app.use("/api/comments", comments);

// Adding some HATEOAS links.
app.get("/", (req, res) => {
  res.json({
    links: [
      {
        href: "/api",
        rel: "api",
        type: "GET",
      },
    ],
  });
});

// Adding some HATEOAS links.
app.get("/api", (req, res) => {
  res.json({
    links: [
      {
        href: "api/users",
        rel: "users",
        type: "GET",
      },
      {
        href: "api/users",
        rel: "users",
        type: "POST",
      },
      {
        href: "api/posts",
        rel: "posts",
        type: "GET",
      },
      {
        href: "api/posts",
        rel: "posts",
        type: "POST",
      },
    ],
  });
});

// 404 Middleware
app.use((req, res, next) => {
  next(error(404, "Resource Not Found"));
});

// Error-handling middleware.
// Any call to next() that includes an
// Error() will skip regular middleware and
// only be processed by error-handling middleware.
// This changes our error handling throughout the application,
// but allows us to change the processing of ALL errors
// at once in a single location, which is important for
// scalability and maintainability.
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}.`);
});

