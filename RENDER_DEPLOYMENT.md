# Render Deployment Guide for PMS Fullstack

## Changes Made for Render Deployment

### 1. Root `package.json` Updates
Added the following scripts:
- `install`: Installs dependencies for both backend and frontend
- `build`: Builds the frontend React application
- `start`: Starts the backend server in production mode
- `dev:backend` & `dev:frontend`: Development scripts

### 2. Backend Configuration (`backend/src/app.js`)
- Added static file serving for the frontend build in production
- Configured Express to serve `frontend/dist` folder
- Added catch-all route to handle client-side routing (React Router)

### 3. Render Configuration (`render.yaml`)
Created a Render blueprint for automated deployment setup.

## Deployment Steps on Render

### Option 1: Using Render Dashboard (Recommended)

1. **Create a New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `https://github.com/Chandan767/pmsss`

2. **Configure the Web Service**
   - **Name**: `pms-fullstack` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

3. **Set Environment Variables**
   Click "Advanced" and add these environment variables:
   
   ```
   NODE_ENV=production
   DATABASE_URL=<your-postgres-connection-string>
   JWT_SECRET=<generate-a-secure-random-string>
   PORT=5000
   ```

   **Important**: For `DATABASE_URL`, you'll need to create a PostgreSQL database first (see Database Setup below).

4. **Database Setup**
   - In Render Dashboard, click "New +" → "PostgreSQL"
   - **Name**: `pms-db`
   - **Database**: `pms_db`
   - **User**: `pms_user`
   - After creation, copy the "Internal Database URL"
   - Paste it as the `DATABASE_URL` in your web service environment variables

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - Wait for the build to complete (usually 3-5 minutes)

### Option 2: Using render.yaml (Blueprint)

1. In Render Dashboard, click "New +" → "Blueprint"
2. Connect your repository: `https://github.com/Chandan767/pmsss`
3. Render will automatically detect the `render.yaml` file
4. Review the configuration and click "Apply"
5. Set the required environment variables (DATABASE_URL, JWT_SECRET)

## Database Migration

After deployment, you need to run Prisma migrations:

1. Go to your web service in Render Dashboard
2. Click "Shell" tab
3. Run the following commands:

```bash
cd backend
npx prisma migrate deploy
npx prisma db seed  # Optional: to seed initial data
```

Alternatively, the `npm start` script in `backend/package.json` already includes `prisma migrate deploy`, so migrations will run automatically on each deployment.

## Updating the Schema for PostgreSQL

Currently, your `backend/prisma/schema.prisma` is configured for SQLite:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

For production on Render, update it to use PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Important**: Make this change, commit, and push before deploying to Render.

## Post-Deployment Checklist

- [ ] Database is created and connected
- [ ] Environment variables are set correctly
- [ ] Prisma migrations have run successfully
- [ ] Application is accessible via the Render URL
- [ ] Test login functionality
- [ ] Test API endpoints
- [ ] Verify WebSocket connections work (for chat/real-time features)

## Troubleshooting

### Build Fails
- Check build logs in Render Dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database is in the same region as web service (for better performance)
- Check if Prisma migrations ran successfully

### Frontend Not Loading
- Verify `npm run build` completed successfully
- Check that `frontend/dist` folder is created during build
- Ensure `NODE_ENV=production` is set

### API Routes Not Working
- Verify API routes are defined before the catch-all route in `app.js`
- Check CORS configuration in `backend/src/app.js`

## Monitoring

- View logs in real-time: Render Dashboard → Your Service → Logs
- Set up alerts for downtime or errors
- Monitor database usage and performance

## Custom Domain (Optional)

1. Go to your web service settings
2. Click "Custom Domain"
3. Add your domain and follow DNS configuration instructions

## Support

For issues specific to Render deployment, check:
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
