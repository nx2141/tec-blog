---
title: "TailwindでProseはコンポーネントに分けると良き"
date: "2025-04-30"
description: Tailwind CSS の typography プラグイン (Prose) をコンポーネント化する理由と、Astro / Next.js での実装手順を詳しく解説します。
tags: [Tailwind CSS, Typography, Prose, Frontend, コンポーネント設計]
---

## はじめに

Markdown で記事やドキュメントを書く際、**`@tailwindcss/typography`（通称 Prose）** は非常に便利です。

しかし、スタイルを「どこで」「どのように」管理するかで DX と保守性が大きく変わります。

本記事では **Prose をコンポーネント化するアプローチ** を中心に、Tailwind 設定ファイル (`tailwind.config.ts`) でグローバル上書きする方法との違いまで丁寧に解説します。

---

## Prose とは

簡単にProseについて補足します。

- `@tailwindcss/typography` が提供する **リッチテキスト向けユーティリティ群**  
- `prose` クラスを付与するだけで、見出し・段落・リスト・引用など HTML テキスト要素に調和の取れたスタイルが当たる  
- Markdown のレンダリング結果やブログ記事本文のスタイリングに最適

簡単に言うと、個別にスタイル当てるの面倒なときに役立つ便利なスタイルセットって感じでしょうか。

なお、この記事もProseでスタイリングしています。

---

## スタイリングを管理する 2 つのアプローチ

| 方式 | 概要 | 主なメリット | 主なデメリット |
|------|------|--------------|----------------|
| **グローバル設定**<br>`tailwind.config.ts` で `theme.extend.typography` を上書き | プロジェクト全体に一律で反映 | - 設定は 1 箇所だけ<br>- すべての Prose に即時適用 | - ページ単位での差別化が難しい<br>- 影響範囲が広く副作用リスク |
| **コンポーネント化**<br>`<Prose>` などのラッパーを用意し、そこにクラスを付与 | 使用箇所を限定して適用 | - ページごとに細かな調整が容易<br>- 複数バリアントも作りやすい | - コンポーネントを経由しないとスタイルが当たらない |

骨格となる最低限の共通デザイン_ はグローバル設定、_それ以外の微調整・バリアント_ はコンポーネント側で管理するとバランスが良いと思います。

---

## コンポーネント化を推す 5 つの理由

### 一貫性

記事本文のデザインを 1 箇所で集中管理  

### 拡張性

`ProseCompact`, `ProseWide` などバリエーションを簡単に追加  

### 局所最適化

ページ固有のカスタムスタイルを安全に上書き  

### tailwind‑merge を使える

クラス衝突を自動解決 

### テーマ分離

Light / Dark などテーマごとにラッパーを切り替えやすい  

---

## 実装パターン

### Astro 版

```astro
---
// components/Prose.astro
import { twMerge } from 'tailwind-merge';
const { class: className = '' } = Astro.props;

const base = `
  prose text-white dark:prose-invert
  prose-h2:flex prose-h2:font-semibold prose-h2:flex-col prose-h2:mb-8
  prose-h2:justify-center prose-h2:text-3xl prose-h2:border-l-4
  prose-h2:border-gray-600 prose-h2:py-2 prose-h2:pl-6
`;

const merged = twMerge(base, className);
---

<div class={merged}>
  <slot />
</div>
```

呼び出し例：

```astro
<Prose>
  <MarkdownContent />
</Prose>
```

### Next.js (React) 版

```tsx
// components/Prose.tsx
import { twMerge } from 'tailwind-merge';
import type { ReactNode } from 'react';

type ProseProps = {
  children: ReactNode;
  className?: string;
};

export function Prose({ children, className = '' }: ProseProps) {
  const base = `
    prose text-white dark:prose-invert
    prose-h2:flex prose-h2:font-semibold prose-h2:flex-col prose-h2:mb-8
    prose-h2:justify-center prose-h2:text-3xl prose-h2:border-l-4
    prose-h2:border-gray-600 prose-h2:py-2 prose-h2:pl-6
  `;
  return <div className={twMerge(base, className)}>{children}</div>;
}
```

---

## tailwind‑merge でクラスを安全にマージ

twMergeを使って安全にクラスをマージします。

```tsx
twMerge('flex flex-col', props.className);
```

- **重複クラスを後勝ちで結合**  
- `flex` と `block` など相反するクラスはコンフリクトを解消し「後から渡した方」を残す  
- プロジェクト全体のクラス結合を一元的に安全化できる

---

## グローバル上書きは「最低限」にとどめる

```ts
// tailwind.config.ts
extend: {
  typography: {
    DEFAULT: {
      css: {
        a: { color: '#60a5fa', textDecoration: 'underline' },
        h1: { fontWeight: '700' },
      },
    },
  },
},
```

- 文字サイズ・基本色など **「必ず全ページに反映したい」** ものだけ定義  
- 個別の余白やアイコン挿入などはコンポーネント側で対応する

---

## まとめ

1. **共通の骨格** → `tailwind.config.ts` に集約  
2. **記事単位の調整** → `<Prose>` コンポーネントで上書き  
3. 衝突は **tailwind‑merge** で安全に解決  

これで、 **可読性・保守性・拡張性** のバランスが取れた Prose 運用が可能になります。

---

## 参考リンク

- [@tailwindcss/typography GitHub](https://github.com/tailwindlabs/tailwindcss-typography)
- [tailwind‑merge](https://github.com/dcastil/tailwind-merge)
