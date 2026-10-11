# ServiceHub

Next.js frontend with a Dockerized Express API and MongoDB. Visitors can submit companies for review. Admins approve or reject submissions; only approved companies appear on public pages.

## Local setup

Start Docker Desktop, then run from this folder:

```powershell
# If PowerShell cannot find docker:
$env:Path += ";$env:LOCALAPPDATA\Programs\DockerDesktop\resources\bin"

docker compose up --build -d
docker compose run --rm api npm run seed
npm.cmd run dev
```

Open `http://localhost:3000/add-company` to submit a company, `http://localhost:3000/admin/login` to review submissions, and `http://localhost:4000/api/health` to check the API. Local admin credentials are in the ignored `admin-login.txt` file. If that file or `.env` is missing, run `npm.cmd run admin:credentials` inside `backend` before starting Docker.

If the frontend is already running on port 3000, use that existing server instead of starting a second one. The API currently allows browser requests from `http://localhost:3000`.

See [backend/README.md](backend/README.md) for the review flow, API routes, credentials, and data storage details.
