## Architecture

### Framework
- NextJS app hosted on Vercel

**Reasons**
- Ease of deployment - simply host on Vercel for both the front end and back end
- NextJS on Vercel auto-scales automatically. All routes are treated as serverless functions, which is perfect for this application. There is practically 0 compute, it's all I/O bound operations. There are also no long running processes that would require separate deployments, queues, etc.

### Database
Redis hosted on Upstash to store the key-value pairs

**Reasons:**
- Ultra low-latency lookup
- All that is stored is a key-value pair, so no need for a relational database
- Has a nice free tier, and takes a few minutes to set up

### Front end responsibilities
- Handle HTML file upload
- Extract all links from the HTML content
- Send all URLs to the backend
- Replace original links with the revised ones
- Allow the user to copy or download the updated HTML content

**Key decisions**
- Don't pass entire HTML file to the backend
    - Requires the front end to handle the parsing, but it should be trivial for browsers to handle.
    - This limits the size of data transfer between front end and back end, reducing memory usage on the server
    - Assumed that we're never storing any HTML in a database (could still make an API call to store it if desired)
- URL parsing assumes all links are in href tags, and they are valid full URLs. Relative links wouldn't work, but we'd need the base URL for that to work anyway

### Back end responsibilities
- Generate codes, and upload to the Redis database
- Redirect to the correct url based on short code using a 302 status code (temporary redirect)
    - Doing this in an api route means no JSX is ever rendered when accessing the redirect route

**Key decisions**
- Generating 8 character codes using nanoid
    - nanoid chooses from 64 possible characters, all of which are URL safe
- Handle collisions in the Redis database
    - Slight performance hit here, but it's all network latency when checking. Should just be a single call for nearly all, but would require 2+ if there are collisions (extremely rare with 64^8 combinations though).

