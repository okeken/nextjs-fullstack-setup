# Full Stack Next.js Template ( Database setup + Authentication)

This template is a boilerplate ready-made full-stack setup with Nextjs-auth.

It comes with email service integration( Mailgun ) during any authentication process.

## What's Included

- [ ] Database Integration - Mongodb
- [ ] CSS - Tailwind CSS
- [ ] Authentication - Nextjs-Auth
- [ ] Authentication setup
  - [ ] Login,
  - [ ] Register,
  - [ ] Request Reset Password,
  - [ ] Resend Request Reset Password Email
  - [ ] Reset Password
  - [ ] Change Password ( user has to be logged in),
- [ ] Dark/Mode Integration
- [ ] ProtectedClient Routes
- [ ] Protected Server API Routes
- [ ] Redux Toolkit
- [ ] Redux Query Setup (Coming soon )

## Authentication Endpoints

### Method - Post

| Column                 | Endpoint                                                  | Body Data                                                  |
| ---------------------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| register               | /api/auth/register                                        | { email:'sample@gmail.com', password:'your-password111@' } |
| Request Reset Password | /api/auth/forgot-password?email=sample@mail.com           |                                                            |
| Confirm Token          | /api/auth/confirm-token?token=aaaaabbb122&userId=12345567 |                                                            |
| Resend Request Email   | /api/auth/resend-password-request?userId=aaaaabbb122&     |                                                            |
| Reset Password         | /api/auth/reset-password                                  | { userId, token, password, passwordConfirm }               |

## How to run the project locally

Step 1: Clone this repository:

```bash
git clone https://github.com/okeken/nextjs-auth.git
```

Step 2: Install dependencies:

```bash
yarn install
```

Step 3: Run the development server:

```bash
yarn dev
```
