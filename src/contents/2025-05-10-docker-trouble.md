---
title: "Win11環境でWSL/Dockerが動かない 0x80370102"
description: "WSL2 の 0x80370102／Hyper‑V 起動失敗から黒画面、最終的なクリーンインストールと Docker 復活までの全手順を時系列でまとめました。再発防止のコツも付属。"
date: 2025-05-10
tags: ["Windows11", "WSL2", "Docker", "Hyper-V", "Troubleshooting"]
---

# はじめに

長年使い続けた **Windows 10 → 11 アップグレード環境**  
＋ **HDD→SSD クローン** という “盛り合わせ状態” で  
ついに **WSL2 が起動せず Docker も動かない** 事態が発生。

エラーは **`0x80370102 (HCS_E_HYPERV_NOT_INSTALLED)`**。  
黒画面・ブート失敗も絡み、泥沼のデバッグがスタートしました。

---

## 全体フロー

1. 発生した症状  
2. BIOS／Windows 機能チェック  
3. WSL2／Hyper‑V 修復の試行錯誤  
4. EFI／BCD の手動再構築  
5. 修復インストール失敗 → 黒画面  
6. クリーンインストール決断  
7. Docker Desktop & 開発環境復活  
8. 学びとベストプラクティス  

---

## 1. 発生した症状

| 現象 | 詳細 |
|------|------|
| WSL2 で Ubuntu インストール失敗 | `HCS_E_HYPERV_NOT_INSTALLED` |
| Docker Desktop (WSL backend) | WSL2 エンジン起動不可 |
| Docker Desktop (Hyper‑V backend) | `Hyper‑V setup error` |
| 修復インストール | `0xC1900101 – 0x40017` で SECOND_BOOT 失敗 |
| 起動後 | 黒画面＋マウスのみ |

---

## 2. BIOS / Windows 機能チェック

- **Intel VT‑x / VT‑d** → Enabled  
- **Secure Boot** → Enabled（後に一時無効化して検証）  
- **CSM** → Disabled  
- **Windows の機能**  
  - Hyper‑V  
  - 仮想マシンプラットフォーム  
  - Linux 用 Windows サブシステム  

> → どれも有効にもかかわらず WSL2 は起動せず。

---

## 3. WSL2 / Hyper‑V 修復の試行錯誤

| 手段 | 結果 |
|------|------|
| `dism /enable-feature` で再有効化 | 変化なし |
| `bcdedit /set hypervisorlaunchtype auto` | エラー継続 |
| Secure Boot OFF | 効果なし |
| Docker Hyper‑V backend | `Hyper‑V VM 起動に失敗` |

---

## 4. EFI / BCD 手動修復

```batch
diskpart
select disk 0
select partition 1   # EFI
assign letter=S
bcdboot D:\Windows /s S: /f UEFI
```

- `bootrec /fixboot` がアクセス拒否 → `bootsect /nt60 SYS /mbr` で回避  
- Boot Manager は復旧、Windows 起動成功  

---

## 5. 修復インストール失敗 → 黒画面

- In‑Place Upgrade を試みるも `0xC1900101 – 0x40017`  
- セーフモードでも改善せず  
- **結論：システムファイル／レジストリ破損が深刻**  

---

## 6. クリーンインストール

まさかの「レジストリ破損の疑い」というところまで来てしまいましたが、

思い起こせば windows7 -> クローン -> windows10 -> クローン -> windows11

と、クローンし続けて今日に至ったことを思い出しました。

レジストリがおかしくなっていても不思議はないです。

というわけで、意を決してくクリーンインストールを実行することにしました。(面倒..)

1. Media Creation Tool で USB インストーラ作成  
2. **全パーティション削除 → 未割当で「次へ」**  
3. 新規 Windows 11 Pro セットアップ  
4. Windows Update 完了後、必要アプリを再導入  

---

## 7. Docker & 開発環境復活

```powershell
wsl --install -d Ubuntu
docker run --rm hello-world
```

- WSL2 + Docker Desktop (WSL backend) が一発成功  
- Fastify API・MySQL コンテナも問題なく起動  

---

## 8. 学び & ベストプラクティス

| 学び | メモ |
|------|------|
| 長年のアップグレード環境は **壊れ方が複雑** | 不具合が連鎖する |
| EFI/BCD の手動修復は最後の砦 | `bcdboot` + `bootsect` |
| 修復インストールでも直らない場合がある | レジストリ深部破損は再インストールが早い |
| **クリーンインストール ≠ 敗北** | 時間短縮・精神衛生に最適解 |

---

## 参考リンク

- Microsoft 公式：WSL トラブルシューティング  
  <https://learn.microsoft.com/windows/wsl/troubleshooting>
- Hyper‑V ブート修復ガイド  
  <https://learn.microsoft.com/windows-server/virtualization/>

---

🚀 **これで Docker も WSL2 も快適に動作！**  

同じ沼にハマった方の参考になれば幸いです。
