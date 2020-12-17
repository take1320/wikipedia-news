# wikipedia-news functions

Cloud Functions処理

### ローカル環境の設定方法

端末にnodenvをインストールする。

nodenvにて`v10.19.0`をインストールする。

    nodenv install

`firebase-tools`、`yarn`をインストールする。

    npm install -g firebase-tools
    npm install -g typesync
    npm install -g yarn
    exec $SHELL -l

npm パッケージのインストール

    yarn install

config の設定

    firebase functions:config:set locale.region="asia-northeast1" locale.timezone="Asia/Tokyo" rakuten_rapid_api.api_key="{api_key}"

config の取得

    firebase functions:config:get > .runtimeconfig.json

秘密鍵の設置

-   firebaseプロジェクトの秘密鍵を下記に配置してください。

    ./src/wikipedia-news-firebase-adminsdk.json

ローカル環境で実行

-   ローカル環境で起動

      yarn serve

-   リクエストの動作確認

    <http://localhost:5000/wikipedia-news/asia-northeast1/fetchHeadlines>

### Tips

`firebase` コマンド実行時に401エラーが発生する場合

-   エラー内容

        Error: HTTP Error: 401, Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential.

-   対応としては下記コマンドで再度認証を行う

         firebase login --reauth
