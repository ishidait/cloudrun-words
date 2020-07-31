# Google Cloud Run で動く Node.js アプリケーションのサンプルプロジェクト

https://ishida-it.com/blog/post/2020-07-23-cloudrun-nodejs-1/

## フロントエンド React アプリケーションのデバッグ実行

```bash
> npm run dev:client
```

## バックエンド Express アプリケーションのデバッグ実行

```bash
> npm run dev
```

## フロントエンド React アプリケーションの Production 用ビルド

```bash
> export WORDS_API_URL="https://words-app-xxxxxxxxx-xx.a.run.app"
> npm run build:client
```

## Cloud 上での Docker コンテナのビルド

```bash
> PROJECT_ID=your-project-id
> gcloud builds submit --tag=gcr.io/$PROJECT_ID/words-app --project=$PROJECT_ID
```
