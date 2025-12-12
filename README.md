# IntraLinked Test App

A NestJS application with MongoDB integration for employee data management.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB (local or Atlas cloud instance)

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your MongoDB connection string:

```bash
cp .env.example .env
```

Edit `.env`:
```dotenv
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/EmployeeData
```

### 3. Development

**Start development server with watch mode:**
```bash
npm run start:dev
```

**Start in debug mode:**
```bash
npm run start:debug
```

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

### 4. Testing

```bash
npm run test          # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run e2e tests
npm run test:cov     # Run with coverage
```

## Project Structure

```
src/
  ├── app.controller.ts       # Main routes
  ├── app.module.ts           # Root module
  ├── app.service.ts          # App services
  ├── main.ts                 # Entry point
  └── users/                  # Users feature module
      ├── users.controller.ts
      ├── users.service.ts
      ├── users.module.ts
      ├── dto/                # Data Transfer Objects
      ├── entities/           # TypeORM entities
      └── schemas/            # Mongoose schemas
```

## Deployment

### Prerequisites for Deployment

1. **Set Environment Variables** on your hosting platform:
   - Add `MONGODB_URI` to your production environment
   - Add `PORT` if needed (defaults to 3000)

2. **GitHub Actions** automatically builds and tests on push to `main` or `master` branch

### Deploying to Azure

If deploying to Azure App Service, ensure:
- Node.js runtime is configured (18.x or higher)
- Environment variables are set in Application Settings
- App builds and starts correctly locally first

## Security Notes

⚠️ **IMPORTANT**
- `.env` file is NOT committed to Git (see `.gitignore`)
- Never commit sensitive credentials or secrets
- MongoDB credentials should be stored in environment variables
- Use `.env.example` as a template for required variables

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Run production build |
| `npm run start:dev` | Development with watch mode |
| `npm run start:debug` | Debug mode |
| `npm run start:prod` | Production start |
| `npm run build` | Compile TypeScript |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run test:e2e` | Run e2e tests |

## Troubleshooting

### Build Fails: "Could not find TypeScript configuration file"
- Ensure `tsconfig.json` and `tsconfig.build.json` exist in the root directory
- Run `npm run build` to verify

### MongoDB Connection Error
- Check `MONGODB_URI` environment variable is set correctly
- Verify MongoDB instance is running and accessible
- Check network security groups (if using cloud MongoDB)

### Port Already in Use
- Change the PORT environment variable:
  ```bash
  PORT=3001 npm start
  ```
