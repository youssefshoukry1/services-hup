# ServiceHub submissions and admin review

The Next.js site at `http://localhost:3000` uses the Express API at `http://localhost:4000`. Docker Compose runs Express and MongoDB. A named volume keeps MongoDB data, and another keeps uploaded logos.

## Run locally

From the repository root in PowerShell:

```powershell
# Only if PowerShell cannot find docker:
$env:Path += ";$env:LOCALAPPDATA\Programs\DockerDesktop\resources\bin"

# Generate local credentials if .env and admin-login.txt do not already exist:
cd backend
npm.cmd run admin:credentials
cd ..

docker compose up --build -d
docker compose run --rm api npm run seed
npm.cmd run dev
```

For this workspace, the generated credentials are already in the ignored `admin-login.txt` file in the repository root. Open that file locally, then visit `http://localhost:3000/admin/login`. Do not commit `.env` or `admin-login.txt`. To replace the local credentials, run `npm.cmd run admin:credentials -- --force` from `backend`, then `docker compose up -d --force-recreate api`. Existing admin sessions remain valid for up to seven days; sign them out before rotating credentials if needed.

## Review flow

1. A visitor fills in `/add-company`, optionally selects a PNG, JPEG, or WebP logo under 2 MB, and clicks **Zur Prüfung einreichen**. **Entwurf speichern** saves only to that browser.
2. `POST /api/company-submissions` accepts multipart form data with a `data` JSON field and optional `logo` file. The API creates the ID and sets `status: "pending"`.
3. The admin signs in and reviews `/admin/submissions`. Approve and Reject move a pending record to `approved` or `rejected`; a rejected record can include a reason.
4. Public company endpoints and website listings return approved records only. The 15 seeded examples are approved.

## API routes

| Method | Route | Access |
| --- | --- | --- |
| GET | `/api/health` | Public |
| GET | `/api/services`, `/api/services/:id` | Public |
| GET | `/api/companies`, `/api/companies/:id` | Public, approved only |
| POST | `/api/company-submissions` | Public, creates pending |
| POST | `/api/admin/login`, `/api/admin/logout` | Login public; logout admin |
| GET | `/api/admin/me` | Admin |
| GET | `/api/admin/companies?status=pending` | Admin; also accepts approved or rejected |
| POST | `/api/admin/companies/:id/approve` | Admin, pending only |
| POST | `/api/admin/companies/:id/reject` | Admin, pending only; optional `{ "reason": "..." }` |
| POST, PUT, DELETE | `/api/services`, `/api/services/:id` | Admin |
| POST, PUT, DELETE | `/api/companies`, `/api/companies/:id` | Admin |

Admin sessions use an HTTP only cookie. The API checks the session on every protected request. Admin write requests and the public submission endpoint are restricted to the configured browser origin. This is a local development setup; configure HTTPS, a production origin, and a proper admin account lifecycle before deploying publicly.

`docker compose logs -f api` shows API logs. `docker compose down` stops the containers without deleting data. **`docker compose down -v` deletes the database and uploaded logos.**
