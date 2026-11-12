# Personal Portfolio – React + Express.js + Prisma ORM + MySQL

1. Purpose
A personal portfolio website that demonstrates database integration. Portfolio projects are stored in MySQL and managed (Create, Read, Update, Delete) through Prisma ORM from the "Manage Projects" section. The contact form saves visitor messages to MySQL through Prisma. Nothing is stored in the browser, and there is no static project data: if MySQL is down, the site shows a clear database error.

2. Technology
React + Vite (front-end), Node.js + Express.js (REST API), Prisma ORM 6, MySQL (XAMPP), JavaScript.
Flow: React → Express API (`/api/...`) → Prisma Client → MySQL. Prisma and the database credentials exist only on the server.

3. Database models (`server/prisma/schema.prisma`)
| Model → table | Fields |
|---|---|
| `Project` → `projects` | id (Int, auto-increment), title, description, technologies (comma-separated), image (optional), githubLink (optional), liveDemo (optional), createdAt, updatedAt |
| `Message` → `messages` | id (Int, auto-increment), name, email, subject, message, createdAt |

Migrations are in `server/prisma/migrations/`: `0_init` (the `messages` table, baseline) and `1_add_projects` (the `projects` table).

4. Prisma ORM implementation
- `server/src/db.js` creates one Prisma Client (connection string from `DATABASE_URL`).
- `server/src/routes/projects.js`: `GET /api/projects` (`findMany`), `GET /api/projects/:id` (`findUnique`), `POST` (`create`), `PUT /:id` (`update`), `DELETE /:id` (`delete`). Input and IDs are validated; missing records return 404.
- `server/src/routes/contact.js`: `POST /api/contact` saves with `prisma.message.create`.
- `server/src/errors.js` turns database problems into clear messages (MySQL not running, wrong credentials, tables not migrated).

5. MySQL and environment configuration
1. Start **MySQL** in XAMPP. The database `portfolio_db` must exist (create it in phpMyAdmin if it does not).
2. In Command Prompt:

cd server
copy .env.example .env

3. Open `server\.env` and set `DATABASE_URL` with your real values (the same ones you already use):
`DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE"` (XAMPP default: `mysql://root@localhost:3306/portfolio_db`).
`.env` is private and is never committed. `.env.example` holds placeholders only.

6. Installation

cd server
npm install

This installs Prisma 6 (`@prisma/client@6`, `prisma@6`) and runs `prisma generate`. Prisma is already initialized for MySQL, so `prisma init` is not needed.

cd ..\client
npm install


7. Migration commands
Use `migrate deploy` (non-destructive). **Never run `prisma migrate reset`**; it erases all data.

A. The database already has the `messages` table** (existing contact messages). Baseline once, then add `projects`:

cd server
npx prisma migrate resolve --applied 0_init
npm run db:migrate

B. Empty database:**

cd server
npm run db:migrate

Other commands: `npm run db:status` (migration status), `npm run db:generate` (regenerate Prisma Client after a schema change), `npm run db:studio` (Prisma Studio at http://localhost:5555).
Optional: `npm run db:seed` inserts the "LSPU Campus Navigation and Student Concern Management System" project once (it skips if it already exists).

8. Start the application
Terminal 1 (backend):

cd server
npm start

Expect `API running on port 5000` and `MySQL connected through Prisma.` Health check: http://localhost:5000/api/health

Terminal 2 (frontend):

cd client
npm run dev

Open http://localhost:5173. Use **Manage** in the menu to reach the Manage Projects section.



9. Folder structure

client/                      React app (Vite): src/components, src/hooks/useProjects.js, src/api.js, src/data/profile.js, public/ (resume.pdf, photo, certs/, projects/)
server/
  prisma/schema.prisma       models
  prisma/migrations/         migration files
  prisma/seed.js             optional seed
  src/index.js               Express app
  src/db.js                  Prisma Client
  src/validators.js          input and id validation
  src/errors.js              clear database error messages
  src/routes/                projects.js, contact.js
  test/checks.js             offline checks (npm test)
  .env.example               placeholders
.gitignore
README.md


10. Git and GitHub submission
Create an empty repository on GitHub first, then replace `YOUR_GITHUB_REPOSITORY_URL` with your real URL.
Test-NetConnection github.com -Port 443    // to test if the network you use is compatible
git --version
git init
git branch -M main
git status
git add .
git config --global user.name  ""
git config  --global user.email
git commit -m "Initial project commit"
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
