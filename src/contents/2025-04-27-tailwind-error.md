---
title: "tailwindcss v5 @plugin の黄色下線 errorについて【VSコード】"
date: "2025-04-27"
---

## Errorの状況

Astro ver.5 プロジェクトにて`@plugin "@tailwindcss/typography";` をglobals.cssで呼び出したところ、

@pluginの箇所に下記のエラーが表示されました。

```bash
Unknown at rule @plugincss(unknownAtRules)
```

■ 発生した環境

- React v5
- tailwindcss v4

## エラーの原因

こちらはglobals.cssを表示している間だけエラーが表示されるため(閉じるとエラーが消える)

これはVSコード上で認識できないだけのエラーです。

というわけで無視してOKです。

### エラーを消す方法

.vscode/settings.json にこう書けば、「@plugin」や「@tailwind」みたいな未知ルールを無視するようにできます。

```json
{
  "css.lint.unknownAtRules": "ignore"
}
```

これでglobals.css開いても警告出なくなります。
