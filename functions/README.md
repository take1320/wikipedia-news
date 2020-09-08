# wikipedia-news functions

Cloud Functions処理

## 環境構築

config の設定

    firebase functions:config:set locale.region="asia-northeast1" locale.timezone="Asia/Tokyo" rakuten_rapid_api.api_key="{api_key}"

config の取得

    firebase functions:config:get >| .runtimeconfig.json
