---
title: "tailwindcss v5 @plugin の黄色下線 errorについて【VSコード】"
date: "2025-04-27"
---

# @plugin "@tailwindcss/typography"; errorについて

## Errorの状況

Astro ver.5 プロジェクトにて`@plugin "@tailwindcss/typography";` をstyles/globals.cssで呼び出したところ、

@pluginの箇所にエラーが表示されました。

```bash
Unknown at rule @plugincss(unknownAtRules)
```

React v5
tailwindcss v4

## 未だ解決せず

こちらの問題はいまだ解決していませんが、globals.cssを表示している間だけエラーが表示されるため(閉じるとエラーが消える)

VSコード上で認識できないだけのエラーなのかなと思い、ひとまず放置しています。

解決したらお知らせします。

※他のAstro 5プロジェクトでは同様の問題が出ないのですが..
