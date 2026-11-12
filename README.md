# Personal Portfolio – React + Express.js + Prisma ORM + MySQL

## 1. Purpose
A personal portfolio website that demonstrates database integration. Portfolio projects are stored in MySQL and managed (Create, Read, Update, Delete) through Prisma ORM from the "Manage Projects" section. The contact form saves visitor messages to MySQL through Prisma. Nothing is stored in the browser, and there is no static project data: if MySQL is down, the site shows a clear database error.

## 2. Technologies
React + Vite (front-end), Node.js + Express.js (REST API), Prisma ORM 6, MySQL (XAMPP), JavaScript.
Flow: React → Express API (`/api/...`) → Prisma Client → MySQL. Prisma and the database credentials exist only on the server.

## 3. Database models (`server/prisma/schema.prisma`)
| Model → table | Fields |
|---|---|
| `Project` → `projects` | id (Int, auto-increment), title, description, technologies (comma-separated), image (optional), githubLink (optional), liveDemo (optional), createdAt, updatedAt |
| `Message` → `messages` | id (Int, auto-increment), name, email, subject, message, createdAt |

Migrations are in `server/prisma/migrations/`: `0_init` (the `messages` table, baseline) and `1_add_projects` (the `projects` table).

## 4. Prisma ORM implementation
- `server/src/db.js` creates one Prisma Client (connection string from `DATABASE_URL`).
- `server/src/routes/projects.js`: `GET /api/projects` (`findMany`), `GET /api/projects/:id` (`findUnique`), `POST` (`create`), `PUT /:id` (`update`), `DELETE /:id` (`delete`). Input and IDs are validated; missing records return 404.
- `server/src/routes/contact.js`: `POST /api/contact` saves with `prisma.message.create`.
- `server/src/errors.js` turns database problems into clear messages (MySQL not running, wrong credentials, tables not migrated).

## 5. MySQL and environment configuration
1. Start **MySQL** in XAMPP. The database `portfolio_db` must exist (create it in phpMyAdmin if it does not).
2. In Command Prompt:
```
cd server
copy .env.example .env
```
3. Open `server\.env` and set `DATABASE_URL` with your real values (the same ones you already use):
`DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE"` (XAMPP default: `mysql://root@localhost:3306/portfolio_db`).
`.env` is private and is never committed. `.env.example` holds placeholders only.

## 6. Installation
```
cd server
npm install
```
This installs Prisma 6 (`@prisma/client@6`, `prisma@6`) and runs `prisma generate`. Prisma is already initialized for MySQL, so `prisma init` is not needed.
```
cd ..\client
npm install
```

## 7. Migration commands
Use `migrate deploy` (non-destructive). **Never run `prisma migrate reset`**; it erases all data.

**A. The database already has the `messages` table** (existing contact messages). Baseline once, then add `projects`:
```
cd server
npx prisma migrate resolve --applied 0_init
npm run db:migrate
```
**B. Empty database:**
```
cd server
npm run db:migrate
```
Other commands: `npm run db:status` (migration status), `npm run db:generate` (regenerate Prisma Client after a schema change), `npm run db:studio` (Prisma Studio at http://localhost:5555).
Optional: `npm run db:seed` inserts the "LSPU Campus Navigation and Student Concern Management System" project once (it skips if it already exists).

## 8. Start the application
Terminal 1 (backend):
```
cd server
npm start
```
Expect `API running on port 5000` and `MySQL connected through Prisma.` Health check: http://localhost:5000/api/health

Terminal 2 (frontend):
```
cd client
npm run dev
```
Open http://localhost:5173. Use **Manage** in the menu to reach the Manage Projects section.

## 9. Test CREATE, READ, UPDATE, DELETE
1. **CREATE:** in Manage Projects fill the form and click Add project. A success message appears and the project shows in "Saved projects" and in the Projects section.
2. **READ:** reload the page. The projects load from MySQL. You can also open http://localhost:5000/api/projects to see the JSON.
3. **UPDATE:** click Edit, change a value, click Save changes. The change shows everywhere.
4. **DELETE:** click Delete and confirm. The project disappears from the list and the Projects section.
5. **Contact form:** send a message in the Contact section, then check the `Message` table in Prisma Studio.

## 10. Verify database persistence
- Refresh the browser: the records are still there.
- Stop the backend with Ctrl+C, run `npm start` again, reload: the records are still there.
- Open `npm run db:studio` (or phpMyAdmin → `portfolio_db` → `projects` / `messages`) and see the same records.

## 11. If MySQL is unavailable
The Projects section, Manage Projects section, and contact form show the message "Cannot connect to the MySQL database. Start MySQL (XAMPP) and check DATABASE_URL...". If the backend is not running they show "Cannot reach the backend API. Start it with npm start". If tables are missing they tell you to run `npm run db:migrate`.

## 12. Folder structure
```
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
```

## 13. Git and GitHub submission
Create an empty repository on GitHub first, then replace `YOUR_GITHUB_REPOSITORY_URL` with your real URL.
```
git --version
git init
git branch -M main
git status
git add .
git commit -m "Initial project commit"
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
`git status` must not list `.env` or `node_modules`. The migrations, `schema.prisma`, `.env.example`, and this README are included. Later updates:
```
git add .
git commit -m "Update portfolio CRUD application"
git push
```
Security: the project management section has no login (classroom demo). On a public deployment set `ALLOW_PROJECT_EDITS=false` in `server/.env` to block create/update/delete.

## 14. Testing status
Checked offline: Node syntax check of all server files, `npm test` (input validation and database-error mapping), and `.gitignore` behavior with Git. NOT yet run by the author of this README: MySQL connection, Prisma migrations, the API routes against a real database, and the React screens. Follow sections 7 to 10 and confirm each step yourself.
