# Google Cloud Run で動く Node.js アプリケーションのサンプルプロジェクト

https://ishida-it.com/blog/post/2020-07-23-cloudrun-nodejs-1/

## フロントエンド側 React アプリケーションのビルド方法

```bash
> export WORDS_API_URL="https://words-app-xxxxxxxxx-xx.a.run.app"
> npm run dev:client
```

## Cloud 上での Docker コンテナのビルド方法

```bash
> PROJECT_ID=your-project-id
> gcloud builds submit --tag=gcr.io/$PROJECT_ID/words-app --project=$PROJECT_ID
```
