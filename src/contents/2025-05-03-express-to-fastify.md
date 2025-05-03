---
title: "現代はExpressよりFastifyがバックエンドフレームワークの現代的な選択"
date:  "2025-05-03"
---

## はじめに

JavaScript でバックエンド API を構築する際、**Express** は依然として最も広く使われているフレームワークです。  
State of JavaScript 2023 の調査によると、回答者の **約 73 %** が Express を「過去 1 年以内に利用した」と回答しており、次点の Nest（約 30 %）、Fastify（約 17 %）を大きく引き離しています[^1]。  

しかし、モダンな開発体験・パフォーマンス・型安全性といった観点からは、**Fastify を選択することが今日の最適解**になりつつあります。  
本記事では Express の現状を押さえながら、Fastify を「現代的な選択」と位置付ける理由、そして新興フレームワーク **Hono** への期待と課題を整理します。

---

## Express のシェアが依然として高い理由

| 項目 | 主な理由 |
| --- | --- |
| 歴史と実績 | 2010 年リリース。豊富な記事・書籍・サンプルコードが存在し、**学習コストが低い**。 |
| エコシステム | Connect 互換ミドルウェアが多数。既存プロジェクトや SaaS のテンプレートが充実。 |
| マイグレーションコスト | 他言語や他フレームワークへの移行ハードルが高く、**惰性的に使い続けられやすい**。 |

Express は **「困ったら検索で解決できる安心感」** が最大の強みです。実装を急ぐスタートアップや学習用途では今後も一定の需要が続くでしょう。

---

## Fastify が「現代的」な選択となる 5 つの理由

1. **パフォーマンスが段違い**  
   - 公式ベンチマークでは「Hello World」で Express の 2〜3 倍のリクエスト/秒を記録。  
   - JSON スキーマによるシリアライズ最適化で、複雑なレスポンスでも高速。

2. **移行コストが低い**  
   - ルーティング API (`fastify.get()`, `fastify.post()` など) が Express とほぼ同一。  
   - `@fastify/express` プラグインで Express ミドルウェアを流用可能。

3. **型安全でエラーが減る**  
   - TypeScript を公式サポート。`as const` なスキーマ定義で **リクエスト・レスポンスの型が自動生成**。  
   - IDE での補完やリファクタリングが容易。

4. **プラグインエコシステムが活発**  
   - 認証 (`@fastify/jwt`)、ORM、GraphQL、WebSocket など公式プラグイン多数。  
   - [Mercury.js] など採用事例も増加し、コミュニティが急拡大。

5. **セキュリティ & 安定性**  
   - 入力検証を**デフォルトで強制**できるため、バリデーション抜けによる脆弱性リスクを抑制。  
   - v4 LTS と v5 最新版が併走し、**長期運用**しやすいリリース方針。

---

## 気になる新星：Hono の可能性と課題

| ポイント | 概要 |
| --- | --- |
| **Edge/マルチランタイム志向** | Cloudflare Workers・Bun・Deno など **あらゆる JavaScript 実行環境**で動作[^2]。 |
| **超軽量 & 高速** | `hono/tiny` プリセットは **14 kB 未満**。RegExp ルータで高速ルーティング。 |
| **Web 標準 API ベース** | `Request`/`Response` などブラウザ API に準拠し、将来的なランタイム統合が容易。 |
| **コミュニティ規模** | GitHub ⭐ 数は急上昇中だが、プラグイン・知見はまだ少ない。 |
| **実運用の歴史** | 大規模プロダクションの事例は少数。**長期保守の知見が不足**。 |

> **結論**：Hono は「Edge × JavaScript」の未来を感じさせるフレームワークですが、**現時点では情報が限られ、社内標準として採用するには慎重な判断が必要**です。トライアル用途には最適ですが、安定運用を重視するなら Fastify が一歩リードしています。

---

## Fastify を採用する際の移行ガイド（簡易版）

1. **環境構築**  
   ```bash
   npm i fastify
   npm i -D typescript ts-node @types/node
   ```

2. **既存 Express ルートの書き換え**  
   - `app.get('/users', handler)` → `fastify.get('/users', async (req, reply) => { /* ... */ })`
   - `res.status(201).json(data)` → `reply.code(201).send(data)`

3. **ミドルウェアの移行**  
   - `cors`, `helmet` などは `@fastify/cors`, `@fastify/helmet` に置換。  
   - 独自 Express ミドルウェアは `@fastify/express` 経由で暫定利用し、徐々に Fastify プラグインへリプレース。

4. **入力スキーマの追加**  
   ```ts
   fastify.get('/users/:id', {
     schema: {
       params: z.object({ id: z.coerce.number() }),
       response: {
         200: Type.Object({ id: Type.Number(), name: Type.String() })
       }
     },
     handler: async (req, reply) => {
       //...
     }
   })
   ```

5. **パフォーマンス計測と最適化**  
   - `autocannon` でベンチマークを取得し、ボトルネック（I/O, DB, ネットワーク）を把握。  
   - `fastify-plugin` で共通処理を抽出し、起動時のオーバーヘッドを削減。

---

## まとめ

- **Express は依然 70% 超の支持**を持つデファクト・フレームワーク[^1] ですが、**開発体験やパフォーマンスの面で技術的負債**が顕在化しています。  
- **Fastify** は Express と高い互換性を保ちつつ、**高速・型安全・プラグインエコシステム**で「現代的バックエンド」にふさわしい選択肢です。  
- **Hono** の登場でランタイム横断の未来が見えてきましたが、**2024 年時点では Fastify の安定性が一歩優勢**と言えます。  

Express プロジェクトを刷新するタイミングで、まずは **Fastify への段階的移行**を検討してみてはいかがでしょうか。  
そのうえで Edge サービスやマルチランタイム展開が必要になった際、Hono などの次世代フレームワークを試す──。これが 2024 年現在の **現実的かつ拡張性のある戦略**だと考えます。

---

## 参考リンク

- State of JavaScript 2023 – **Back-end Frameworks** セクション[^1]  
- Fastify 公式サイト <https://fastify.dev/>  
- Hono 公式サイト <https://hono.dev/>[^2]  

---

### 脚注

[^1]: State of JavaScript 2023 「Back-end Frameworks」: Express 12,640 票 / 17,190 票 ≒ 73 %【turn1view0】  
[^2]: Hono 公式ドキュメント – 「Multi-runtime」【turn2search7】

