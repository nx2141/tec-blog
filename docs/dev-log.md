# 決済セキュリティ確認事項（忘れそうなもの）

・決済ページの URL を直接アクセスできないようにする

・全てのテーブルに RLS をかける

・既に同じ決済 ID の決済はできないようにする(冪等性)

・supabase への決済完了の書き込みは Next.js 内ではなく、supabase の edge function で行う(安定性UP)

=======

# コンポーネント構成規則（components/ ディレクトリ構成）

本プロジェクトにおける React コンポーネント分類のルールは以下の通りです。

## ディレクトリ構成と分類基準

```
/components
  /form       → 問い合わせや見積もりなどフォーム関連
  /layout     → Header, Footer, ナビゲーションなどの構造部品
  /sections   → ページの意味ある構造ブロック（Hero, FAQ, Flowなど）
  /system     → 技術支援・DOM操作などの非UI機能（Portalなど）
  /text       → H2, H3, Proseなどのテキスト構造・スタイル用
  /ui         → Button, Logo, VideoModalPlayer などの見た目主導UI部品
  /widgets    → 軽量かつ独立して使える補助機能パーツ（FixedContact等）
```

## 各ディレクトリの詳細説明

### `/form`

- フォーム送信・入力 UI に関する専用コンポーネント
- 例：`ContactForm.tsx`, `OmitsumoriForm.tsx`

### `/layout`

- サイト全体の構造に関係するコンポーネント（Header, Footer, メニュー等）
- 例：`Header.tsx`, `HamburgerMenuItems.tsx`

### `/sections`

- ページを構成する意味ある情報ブロック
- コンテンツと構造を持ち、再利用よりもコンテキスト重視
- 例：`MainSlider.tsx`, `ServiceFlow.tsx`, `AreaInfo.tsx`

### `/system`

- 技術的ユーティリティ系（DOM 操作、Portal など）
- 例：`Portal.tsx`

### `/text`

- タイトルや段落などテキストスタイルを担う小コンポーネント群
- 例：`H2Title.tsx`, `Prose.tsx`

### `/ui`

- 再利用可能な小型 UI 部品。見た目主導・ステートレス中心
- 例：`Button.tsx`, `Logo.tsx`, `VideoModalPlayer.tsx`, `CommonWhiteBtn.tsx`

### `/widgets`

- 単独で機能する軽量パーツ。UI+機能を持つこともある
- 例：`FixedContact.tsx`, `ChatWidget.tsx`

---
