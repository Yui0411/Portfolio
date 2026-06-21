# lloydshin.dev

My personal portfolio. The public site presents my experience, projects, and certificates on an interactive timeline, and a private admin panel lets me manage that content without editing the code.

Live at https://lloydshin.dev

## Why it's built this way

I wanted a portfolio I would actually use, but I also treated it as an opportunity to learn the deployment side rather than only the application. Instead of a one-click host, it runs in Docker on an EC2 instance behind Nginx, with a GitHub Actions pipeline that redeploys on every push to `main`. This is more infrastructure than a personal site strictly needs, but learning that stack was a deliberate goal.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind + shadcn/ui
- Supabase for Postgres, auth, and image storage
- Docker, AWS (EC2, ECR, Route 53), Nginx, Let's Encrypt
- GitHub Actions for CI/CD

## Features

The three public pages (experience, projects, certificates) share a single timeline component, each supplied with different data; the certificates page uses dots only, without the connecting line. Pages are server-rendered and read live from Supabase.

The admin area at `/admin` is protected by Supabase Auth, verified in Next.js middleware so the pages do not render for unauthenticated users. From there I can:

- create, edit, and delete experience, projects, and certificates
- upload images, which are stored in Supabase Storage
- edit the home page content

Access control is enforced by Row Level Security in Supabase. Although the public anonymous key is shipped to the browser, it can only read published data; writes require an authenticated session.

## Deployment

Each push to `main` triggers GitHub Actions: it lints, type-checks, builds the Docker image, pushes it to ECR, and then connects to the instance over SSH to pull the new image and restart the container. AWS authentication uses OIDC, so no long-lived AWS keys are stored in GitHub, and the instance pulls from ECR using an IAM role, so no keys are kept on the server either.

## Running locally

```bash
git clone https://github.com/Yui0411/Portfolio.git
cd Portfolio
npm install --legacy-peer-deps
cp .env.local.example .env.local   # add your Supabase URL + keys
npm run dev
```

A Supabase project with the tables set up is required first. The SQL lives in [`supabase/`](supabase/), and [`supabase/SETUP.md`](supabase/SETUP.md) walks through it.

## Possible improvements

- Public pages are rendered on each request; they could be statically generated with periodic revalidation.
- The deploy step connects over SSH on port 22; using AWS SSM would avoid exposing SSH entirely.
- The header contact details are currently hardcoded, though the profile table already includes the fields needed to make them editable.
