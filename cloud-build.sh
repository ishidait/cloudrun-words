PROJECT_ID=cloudrun-words
gcloud builds submit --tag=gcr.io/$PROJECT_ID/words-app --project=$PROJECT_ID
