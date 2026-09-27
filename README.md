# ufodb-playground

`ufodb_v0`（Union-Find DB）をブラウザだけで試せるWebアプリ。UFO Studio（デスクトップアプリ）と同じUI・同じGUI操作を、インストールなしで使える。

公開URL: https://kento-yoshidu.github.io/ufodb_playground/

- サーバーを持たず、`ufodb_v0`をWebAssemblyにしてブラウザのタブ内で動かす
- データは保存しない。リロードやタブを閉じると消える
- UIコンポーネントは[`ufodb-design-system`](https://github.com/kento-yoshidu/ufodb_design_system)を使う

現在の進捗は[`docs/ROADMAP.md`](docs/ROADMAP.md)を参照。

## 開発

Node.js・pnpmに加えて、Rust（`rustup target add wasm32-unknown-unknown`）と[`wasm-pack`](https://github.com/rustwasm/wasm-pack)が必要。

### 初回

```
pnpm install
wasm-pack build wasm --target web
pnpm dev
```

### コマンド一覧

| コマンド | 内容 |
|---|---|
| `pnpm install` | 依存のインストール |
| `wasm-pack build wasm --target web` | Rust（`wasm/`）をWASMにビルドし、`wasm/pkg/`に出力。`pnpm dev`/`pnpm build`の前に必要で、Rustを変更したら毎回実行する |
| `pnpm dev` | 開発サーバー（http://localhost:5173/ufodb_playground/ ） |
| `pnpm build` | ESLint → 型チェック → 本番ビルド（`dist/`に出力） |
| `pnpm preview` | 本番ビルドの確認 |
| `pnpm lint` | ESLintのみ |
| `cargo test`（`wasm/`内で実行） | Rust側のテスト |
| `pnpm update ufodb-design-system` | `ufodb-design-system`の`main`の最新を取り込む（`pnpm-lock.yaml`の変更をコミットする） |

## デプロイ

`main`にマージすると、GitHub ActionsでGitHub Pagesに自動デプロイされる。
