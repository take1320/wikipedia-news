# ウィキペディア in News (バックエンド)

フロントエンド側に表示するニュース記事・ウィキペディア記事を準備するための処理です。

Cloud Functionsを定期実行することで最新記事を取得しCloud Firestoreに保存します。

## バックエンドについて

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

-   リクエストの動作確認<br>※POSTMANの設定を`docs/postman/*`に配置しているのでimportをすると楽です。

    <http://localhost:5000/wikipedia-news/asia-northeast1/fetchHeadlines>

### Tips

コマンドのビルドについて

-   コマンドはtsファイルをビルドしたjsファイルを実行している。package.jsonのscriptにも`/lib/commands/`配下のファイルを実行するよう記述している。
    ビルドの実行には`yarn build`で行うことができるが、IDEでビルドを自動実行しておくと楽。
    -   vscodeの場合、`ターミナル>ビルドタスクの実行 tsc:watch` を実行しておくとファイル保存時に自動でビルドされる。

`firebase` コマンド実行時に401エラーが発生する場合

-   エラー内容

        Error: HTTP Error: 401, Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential.

-   対応としては下記コマンドで再度認証を行う

         firebase login --reauth
