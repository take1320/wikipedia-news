# wikipedia-news

ニュース記事から Wikipedia 記事を抽出する

## Functions について

Comming soon...

## Clientアプリ について

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
