# Deploy to Google Cloud Run

## Prerequisites

1. Install Google Cloud CLI: https://cloud.google.com/sdk/docs/install
2. Authenticate: `gcloud auth login`
3. Set your project: `gcloud config set project YOUR_PROJECT_ID`

## Deployment Steps

### 1. Build and Push Docker Image

```bash
# Set your project ID
export PROJECT_ID=your-gcp-project-id

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build the image
gcloud builds submit --tag gcr.io/$PROJECT_ID/football-training-planner

# Or use Docker directly:
# docker build -t gcr.io/$PROJECT_ID/football-training-planner .
# docker push gcr.io/$PROJECT_ID/football-training-planner
```

### 2. Deploy to Cloud Run

```bash
gcloud run deploy football-training-planner \
  --image gcr.io/$PROJECT_ID/football-training-planner \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1
```

## Important Notes

⚠️ **Database Persistence**: SQLite in Cloud Run is **ephemeral** - data will be lost on restarts!

### Solutions for Production:

**Option 1: Use Cloud SQL (Recommended)**
- Migrate to PostgreSQL or MySQL
- Persistent, scalable database
- Better for production

**Option 2: Cloud Storage + SQLite**
- Mount Cloud Storage bucket
- Copy database on startup/shutdown
- Simple but has limitations

**Option 3: Firestore/Datastore**
- NoSQL alternative
- Fully managed, serverless

## Quick Fix for Testing

For testing purposes, you can use a persistent volume (limited):

```bash
gcloud run deploy football-training-planner \
  --image gcr.io/$PROJECT_ID/football-training-planner \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --execution-environment gen2 \
  --cpu 1 \
  --memory 512Mi
```

## Environment Variables

Set environment variables in Cloud Run:

```bash
gcloud run services update football-training-planner \
  --update-env-vars DATABASE_PATH=/app/data/app.db
```

## Monitoring

View logs:
```bash
gcloud run logs read football-training-planner
```

## Cost Estimate

- Free tier: 2 million requests/month
- Typical cost: $0-10/month for small apps
- Pay only when running

## Next Steps for Production

1. **Migrate to Cloud SQL (PostgreSQL)**
   - Install `pg` package
   - Update database code
   - Use connection pooling

2. **Add secrets management**
   - Use Secret Manager for admin password
   - Environment-specific configs

3. **Set up CI/CD**
   - GitHub Actions
   - Automatic deployment on push

4. **Add custom domain**
   - Map your domain in Cloud Run console
