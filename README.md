# Indie Pulse

インディー開発者のためのMRRダッシュボードアプリ。App Store Connect、Google Play Console、Stripe、RevenueCatなど複数の収益プラットフォームからデータを集約し、MRR、解約率、LTV、ARPUなどの重要指標を可視化します。

## 機能

### ダッシュボード
- MRR、解約率、LTV、ARPUなどの主要KPIをリアルタイム表示
- インタラクティブなMRR推移チャート
- MRRの内訳表示（新規、拡大、縮小、解約）
- AIによるインサイト分析（Proプラン）

### プラットフォーム連携
- Stripe
- App Store Connect
- Google Play Console
- RevenueCat

### 分析機能
- コホート分析（ユーザー獲得月ごとの継続率）
- ファネル分析
- セグメント分析（プラットフォーム別、国別）

### サブスクリプション
- **Starter**: ¥2,500/月 - 2プラットフォームまで連携可能
- **Pro**: ¥5,000/月 - 無制限連携、AI分析機能

## 技術スタック

- **フロントエンド**: React Native (Expo)
- **言語**: TypeScript
- **状態管理**: Zustand
- **UI**: React Native Paper
- **チャート**: react-native-chart-kit
- **バックエンド**: Firebase (Authentication, Firestore, Cloud Functions)
- **テスト**: Jest + React Native Testing Library

## セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn
- Expo CLI
- Firebaseアカウント

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd indie-pulse

# 依存関係をインストール
npm install

# アプリを起動
npx expo start
```

### Firebase設定

1. [Firebase Console](https://console.firebase.google.com/)で新しいプロジェクトを作成

2. **Authentication**を有効化
   - Sign-in methods → Email/Password を有効化

3. **Firestore Database**を作成
   - Production modeで開始
   - リージョン: asia-northeast1（東京）

4. **Webアプリを追加**してFirebase設定を取得

5. `.env`ファイルを作成:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Cloud Functions設定（オプション）

1. Firebase CLIをインストール:
```bash
npm install -g firebase-tools
```

2. Firebaseにログイン:
```bash
firebase login
```

3. Cloud Functionsを初期化:
```bash
firebase init functions
```

4. 環境変数を設定:
```bash
firebase functions:config:set stripe.key="your_stripe_api_key"
```

5. デプロイ:
```bash
firebase deploy --only functions
```

## 開発

### テストの実行

```bash
# すべてのテストを実行
npm test

# ウォッチモードで実行
npm run test:watch

# カバレッジレポート
npm run test:coverage
```

### E2Eテスト (Maestro)

Maestroを使用したE2Eテストが利用可能です。

```bash
# Maestroをインストール (macOS)
brew install maestro

# E2Eテストを実行
maestro test .maestro/

# 特定のフローを実行
maestro test .maestro/auth/login.yaml
```

利用可能なE2Eテストフロー:
- `.maestro/auth/login.yaml` - ログインフロー
- `.maestro/auth/signup.yaml` - サインアップフロー
- `.maestro/auth/passwordReset.yaml` - パスワードリセット
- `.maestro/dashboard/metrics.yaml` - ダッシュボード表示
- `.maestro/integrations/connect.yaml` - プラットフォーム連携

### テスト構成

- **Unit Tests**: Jest + React Native Testing Library
  - コンポーネントテスト: `__tests__/components/`
  - ストアテスト: `__tests__/store/`
  - サービステスト: `__tests__/services/`
- **E2E Tests**: Maestro
  - テストフロー: `.maestro/`

### プロジェクト構造

```
indie-pulse/
├── src/
│   ├── components/          # 再利用可能なコンポーネント
│   │   ├── charts/          # チャートコンポーネント
│   │   ├── cards/           # カードコンポーネント
│   │   ├── common/          # 共通コンポーネント
│   │   ├── dashboard/       # ダッシュボード固有
│   │   └── integrations/    # 連携画面固有
│   ├── screens/             # 画面コンポーネント
│   │   ├── auth/            # 認証関連画面
│   │   ├── dashboard/       # ダッシュボード
│   │   ├── integrations/    # プラットフォーム連携
│   │   ├── analysis/        # 分析画面
│   │   └── settings/        # 設定画面
│   ├── navigation/          # ナビゲーション設定
│   ├── store/               # Zustandストア
│   ├── services/            # APIサービス
│   ├── types/               # TypeScript型定義
│   ├── hooks/               # カスタムフック
│   ├── utils/               # ユーティリティ関数
│   └── constants/           # 定数（テーマなど）
├── __tests__/               # テストファイル
├── functions/               # Firebase Cloud Functions
└── App.tsx                  # エントリーポイント
```

### コマンド

```bash
# 開発サーバーを起動
npm start

# iOSシミュレーターで実行
npm run ios

# Androidエミュレーターで実行
npm run android

# Webブラウザで実行
npm run web

# テスト実行
npm test
```

## デザイン

- ダークモードをデフォルトとして採用
- Stripe DashboardやBaremetricsを参考にしたクリーンなUI
- アクセントカラー: パープル（#8B5CF6）、グリーン（#06D6A0）

## ライセンス

MIT License

## 貢献

プルリクエストを歓迎します。大きな変更を加える前に、まずissueを開いて変更内容を議論してください。

## サポート

問題が発生した場合は、GitHubのissueを作成してください。

---

Built with React Native and Expo
