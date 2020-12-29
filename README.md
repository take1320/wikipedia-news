# ウィキペディア in News

最新のニュースに関連するウィキペディア記事を見ることができるアプリケーションです。

## 構成

| 項目      | 詳細                                               |
| ------- | ------------------------------------------------ |
| DB      | Firebase Cloud Firestore                         |
| バックエンド  | Firebase Cloud Functions,<br>Node.js(Typescript) |
| フロントエンド | Firebase Hosting,<br>React.js(Typescript)        |

基本的にはCloud Functionsが定期処理で取得したニュース情報・ウィキペディア情報をCloud Firestoreに保存し、ReactからCloud Firestore経由で記事を参照することができるという動きになります。

## バックエンドについて

[こちら](./functions/README.md) に記述しています

## フロントエンドについて

### ローカル環境の設定方法

端末にnodenvをインストールする。

nodenvにて`v12.16.1`をインストールする。

    nodenv install

`firebase-tools`、`yarn`をインストールする。

    npm install -g firebase-tools
    npm install -g yarn

npm パッケージのインストール

    yarn install

`.env`を作成しREACT_APP_API_KEYを設定

    cp .env.sample .env
    vi .env

React の起動

    yarn start

ブラウザにて動作を確認

-   <http://localhost:3000/>
