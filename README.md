# Post

A clean social posting dashboard inspired by Twitter/X interaction patterns.

## What this app includes

- Landing/home page with clear entry points (Sign in, Sign up, Guest).  
- Authentication flow for registered accounts and public guest access.  
- Home dashboard where **all accounts, including guest**, can publish posts.  
- Like/unlike support on every post.  
- Profiles directory to view different users and open each profile page.  
- Personal profile view for the currently logged-in account, showing only their posts.  
- Modular front-end structure (separate HTML/CSS/JS modules) instead of a single monolithic file.

## Tech stack

- **Backend:** Node.js, Express, Passport (local strategy), express-session
- **Database:** PostgreSQL
- **Auth/crypto:** bcryptjs
- **Frontend:** Vanilla JavaScript (ES modules), semantic HTML, custom CSS
- **Dev tooling:** nodemon, dotenv

## Project structure

```txt
public/
  index.html
  css/
    main.css
  js/
    api.js
    main.js
server.js
README.md
```

## Setup (step by step)

1. **Clone repo**
   ```bash
   git clone <your-repo-url>
   cd Posting_Dashboard_Project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Set required variables in `.env`**
   ```env
   DATABASE_URL=postgresql://localhost:5432/messaging_app
   SESSION_SECRET=replace_with_long_random_secret
   PORT=3000
   ```

5. **Start PostgreSQL** and ensure the target database exists.

6. **Run the app**
   ```bash
   npm run dev
   ```

7. **Open in browser**
   ```txt
   http://localhost:3000
   ```

## Usage

- On landing page, choose **Sign in**, **Sign up**, or **Continue as guest**.
- Use **Home** to post and like content.
- Use **Profiles** to browse users and inspect their individual posts.
- Use **My Profile** to view your own posts timeline.

## Notes

- This version intentionally keeps the interface concise and comment-free in the feed interactions (likes only).
- Server bootstraps database tables automatically and ensures a reusable Guest account exists.
