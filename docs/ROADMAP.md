# ufodb-playground ロードマップ

`ufodb_v0`をWASMにして、ブラウザだけで動かすWebアプリ。UI・GUI操作はUFO Studioと同じものを`ufodb-design-system`から使う。

## 進め方の方針

- **UIの共有とWASMは別々に進める**: 最初からWASMを入れると、エラーが出たときに「`ufodb-design-system`の読み込み」と「WASMのビルド・初期化」のどちらが原因か切り分けにくい。まずはWASMなしの普通のVite + Reactアプリとして立ち上げ、`ufodb-design-system`のダミーコンポーネントが表示できることを確認してから、WASMを入れる
- **デプロイは早めに通す**: design_systemの`dist/`が`main`で公開されたので、git依存のままCI（GitHub Actions）でビルドできる。ダミーコンポーネントが表示できた時点でGitHub Pagesにデプロイし、以降は変更のたびに公開版でも確認できるようにする
- **UIの組み立てよりWASMを先に通す**: Dummyの表示とデプロイが通った時点で、いちばん不確実なWASM（`ufodb_v0`のWASMビルド、`wasm-pack`、ブラウザでの初期化、CIでのビルド）を最小構成で通す。本物のUIコンポーネントはdesign_system側で揃ってから組み立てる

## Phase 0: プロジェクト初期化

- [x] Vite + React + TypeScriptでプロジェクトを作成する（パッケージ名`ufodb-playground`）
- [x] 独立したgitリポジトリとしてコミットする
- [x] Reactのメジャーバージョンを19に揃える（`ufodb-design-system`の`peerDependencies`が`^19`のため）。Vite・TypeScriptはStudioと揃える必要はない（ライブラリはビルド済みの`dist/`を読むだけなので、利用側のVite・TSのバージョンには依存しない）。現状はdesign_systemと同じVite 8 / TS 6

## Phase 1: `ufodb-design-system`の読み込み確認

`ufodb-design-system`側ROADMAPのPhase 1で作ったダミーコンポーネントを表示する。

- [x] `pnpm add github:kento-yoshidu/ufodb_design_system`で追加する（`node_modules`をサブフォルダで作ってから移動していたため`ERR_PNPM_UNEXPECTED_VIRTUAL_STORE`が出た。`node_modules`を消して入れ直して解決）。`package.json`には`"ufodb-design-system": "github:kento-yoshidu/ufodb_design_system"`と入り、参照したコミットは`pnpm-lock.yaml`に記録される（方針は`CLAUDE.md`の「`ufodb-design-system`への依存」）
- [x] `import "ufodb-design-system/style.css"`を入れる（`main.tsx`）。`dist/index.js`はCSSを自分で読み込まないため、利用側で1回importする必要がある
- [x] `App.tsx`をテンプレートの内容から`<Dummy label="..." />`だけに置き換える
- [x] 確認すること:
  - [x] ダミーコンポーネントが表示され、ボタンを押すと数字が増える（hooksが動く = Reactが1つだけ読み込まれている）。`link:`ではなくgit依存なので、`node_modules/.pnpm`のReactは`react@19.3.0`の1つだけ
  - [x] CSS Modulesのスタイルと、CSS変数（デザイントークン）が効いている
  - [x] エディタでpropsの型が効く（`label`を省くと`Property 'label' is missing ... ts(2741)`になり、`Dummy.d.ts`の定義に飛べる）
  - [x] `pnpm build`（本番ビルド）が通る。出力のCSS（`dist/assets/index-*.css`）にdesign_systemのクラスと`--attention-color`が含まれている
  - [x] `pnpm preview`で本番ビルドも同じように表示される
- [ ] テンプレート由来の`index.css`・`App.css`・`src/assets/`・`public/icons.svg`などを整理する（全体の`button`や文字色のスタイルがdesign_system側の見た目と混ざるため。Phase 4で画面を組み立てる前に片付ける）

## Phase 2: GitHub Pagesへのデプロイ

- [x] リポジトリ名を`ufodb_playground`にリネームする（Pagesの URL が`https://kento-yoshidu.github.io/<リポジトリ名>/`になり、Viteの`base`もこれに合わせるため、デプロイより先に済ませる）
- [x] ローカルの`origin`を新しいURLに変える（`git remote set-url origin git@github.com:kento-yoshidu/ufodb_playground.git`）。旧URL（`playground.git`）もGitHubのリダイレクトで当面は動くが、同じアカウントで`playground`という名前のリポジトリを新しく作るとリダイレクトが切れる
- [x] `vite.config.ts`に`base: "/ufodb_playground/"`を設定する（ビルド後の`index.html`のJS・CSS・faviconのパスが`/ufodb_playground/...`になることを確認済み）
- [x] GitHub Actionsで`pnpm install` → `pnpm build` → `dist/`をPagesにデプロイするworkflowを作る（`.github/workflows/actions.yaml`。`main`へのpushと手動実行で動く）
- [x] リポジトリ設定のPagesのSourceを「GitHub Actions」にする
- [x] 公開URL（https://kento-yoshidu.github.io/ufodb_playground/）でPhase 1と同じ確認をする（`main`へのマージで自動デプロイされ、CSS・`useState`が動くことを確認済み）
- [x] デプロイ手順と`base`の設定を`CLAUDE.md`に追記し、「未決定事項」のホスティング先を消す（テンプレートのままだった`README.md`もプロジェクトの説明に置き換えた）

## Phase 3: WASMの導入（最小構成で動かす）

UIはまだDummyしかないため、画面の組み立てより先に、いちばん不確実なWASMの部分を通しておく。まずサンプルのRustコードでWASMの流れを通し（3-1）、次に`ufodb_v0`につないで`make_set`と`groups`を確認用の画面で動かす（3-2）。

### 3-1: サンプルでWASMの流れを通す（`ufodb_v0`なし）

WASMの仕組み（ビルド → Reactから呼ぶ → CIでビルドしてPagesに公開）を、`ufodb_v0`を使わない小さなRustコードで先に一通り通す。`ufodb_v0`側の対応を待たずに始められ、問題が出たときに「WASMの仕組み」と「`ufodb_v0`のWASM対応」のどちらが原因か切り分けられる。ツール（Rust 1.97・`wasm32-unknown-unknown`ターゲット・`wasm-pack` 0.14）は手元にインストール済み。

- [x] `cargo new --lib wasm`で作り、`Cargo.toml`に`[lib] crate-type = ["cdylib"]`と`wasm-bindgen`の依存を追加する（`cdylib`がないと`.wasm`が出力されない）。既存のgitリポジトリ内で`cargo new`すると`.gitignore`が作られないため、ルートの`.gitignore`に`wasm/target`を追加した
- [x] 数値か文字列を受け渡すだけの関数を1つ、`#[wasm_bindgen]`を付けて公開する（`add(left: usize, right: usize) -> usize`）。`use wasm_bindgen::prelude::*;`が必要。`u64`/`i64`はJS側で`bigint`になるため、最初は`number`になる`u32`/`usize`などを使う
- [x] `wasm-pack build wasm --target web`でビルドし、`wasm/pkg/`に`.wasm`・`.js`（つなぎのコード）・`.d.ts`ができることを確認する。`pkg/`はビルド生成物なのでコミットしない（`wasm-pack`が`pkg/.gitignore`を置く）
- [x] Reactから`pkg/`の`.js`をimportし、`useEffect`で`await init()`してから関数を呼んで結果を表示する。`init()`が終わるまでは関数を呼べないので、準備完了のstateで表示を切り替える（`init()`を待たずにstateを`true`にすると、`Cannot read properties of undefined (reading 'add')`で`<App>`ごと描画が消える。`init().then(() => setWasmReady(true))`で解決）
- [x] `pnpm dev`で`add(1, 2)`の結果（3）が表示されることを確認する。本番ビルドでは`.wasm`が`dist/assets/wasm_bg-*.wasm`にコピーされ、JSからは`base`付きの`/ufodb_playground/assets/...`で読み込まれる（下の公開URLでの確認で、`base`配下でも読み込めることを確認済み）
- [x] CIに、Rustのセットアップ（`wasm32-unknown-unknown`ターゲット）・`wasm-pack`のインストール・`wasm-pack build wasm --target web`を`pnpm build`の前に追加する（`rustup target add` → `Swatinem/rust-cache` → `taiki-e/install-action`で`wasm-pack@0.14.0` → `wasm-pack build`）
- [x] 公開URLでも動くことを確認する（CIで`wasm-pack build`→デプロイされ、Pages上で`a + b = 3`とDummyが表示されることを確認済み）
- [ ] 状態を持つstruct（カウンターなど）を`#[wasm_bindgen]`で公開し、JSから`new`してメソッドを呼び、値が変わることを確認する（`Ufdb`と同じ「作って、操作して、中身を取り出す」形）
  - [x] `Counter`（`#[wasm_bindgen(constructor)]`の`new`・`increment(&mut self)`・`value(&self)`）を公開。Rustを変更したら`wasm-pack build`し直さないと`pkg/`に反映されない
  - [x] Reactでは`init()`の`.then`の中で1回だけ`new Counter()`し、`useRef`に入れて再描画をまたいで持ち続ける（コンポーネント本体で`new`すると再描画のたびに0に戻る）
  - [x] WASMの中の値が変わってもReactは再描画しないため、`increment()`のあとに`value()`を読んで`useState`に入れる（`Ufdb`でも「操作 → `groups()`を読み直す → stateに入れる」の形になる）
  - [x] `pnpm build`が通る（`build`に`eslint .`が入ったため、`eslint.config.js`の`globalIgnores`に`wasm/pkg`などを追加）
  - [x] `pnpm dev`でボタンを押すと数が増えることを確認する
  - [ ] ~~公開URLでも同じように動くことを確認する~~（見送り。画面から`Counter`を外して`Ufdb`の確認に置き換えたため。同じ「`new`して`useRef`で持ち、メソッドを呼ぶ」形は、3-2の`make_set`を公開URLで確認できたことで代わりに確認済み）

### 3-2: `ufodb_v0`につなぐ

前提（`ufodb_v0`側の対応）:

- [x] ~~**ブロッカー**~~（解消）: `ufodb_v0`の`lib`が`wasm32-unknown-unknown`でビルドできなかった。`open`/`tiny_http`（`main.rs`の`SNAPSHOT`でしか使わない）が`[dependencies]`にあり、libのビルドにも巻き込まれていたため（`open`クレートの`compile_error!`で失敗）。2026-09-27、`ufodb_v0`側で依存をfeature（`storage` = `directories`/`serde_json`、`cli` = `clap`/`open`/`tiny_http` + `storage`、`default = ["cli"]`）に分け、binに`required-features = ["cli"]`を付けて解消（`ufodb_v0`の`main`にマージ済み）
- [x] `ufodb/`で`cargo check --lib --target wasm32-unknown-unknown --no-default-features`が通ることを確認する（2026-09-27確認）

Playground側（3-1のサンプルの中身を`Ufdb`に置き換える）:

- [x] `wasm/Cargo.toml`に`ufodb_v0`を追加する。最初はローカルの`ufodb`をpath依存か`[patch]`で参照し、`ufodb_v0`側の変更が`main`に入ったらgit依存（`default-features = false`）に切り替える
  - [x] path依存（`ufodb_v0 = { path = "../../ufodb", default-features = false }`）で追加し、`wasm/`で`cargo check --target wasm32-unknown-unknown`が通ることを確認（2026-09-27）
  - [x] `ufodb_v0`側の変更が`main`に入った（2026-09-27、`29ccd97`）ので、git依存（`git = "https://github.com/kento-yoshidu/ufodb_v0"`、`default-features = false`）に切り替える。path依存のままだとCI（GitHub Actions）には`../../ufodb`が無いためビルドが失敗するので、`main`へマージする前に切り替える
- [ ] `#[wasm_bindgen]`で`Ufdb`をラップした型を公開する。最初は`new`/`make_set`/`groups`だけ。`groups()`は借用（`HashMap<usize, Vec<&String>>`）を返すため、所有権のある型（`Vec<Vec<String>>`など）に変換して返す
  - [x] ラッパーの`struct Ufdb { inner: ufodb_v0::Ufdb }`を作り、`new`（`#[wasm_bindgen(constructor)]`）と`make_set(&mut self, key: &str) -> bool`を公開（他crateの型には`#[wasm_bindgen]`を付けられないため、自分のstructのフィールドに本体を持つ）。`pkg/`は`wasm-pack build`でしか更新されない（`cargo build`/`cargo check`では更新されず、古い`wasm.d.ts`のままで`Ufdb`をimportできなかった）
  - [x] `make_set`をReactから呼ぶと`RuntimeError: memory access out of bounds`になる（2026-09-27）。原因は`StrictMode`で`useEffect`が2回走り、`init()`が同時に2回呼ばれること。`init()`の「初期化済みなら何もしない」チェックは読み込み完了後にしか効かないため、WASMのインスタンスが2つでき、後から完了した方で`wasm`が上書きされる。先に作った`Ufdb`がGCされると、`FinalizationRegistry`がその`free`を「今の」インスタンスに対して呼び、同じアドレスにある生きている`Ufdb`のメモリを解放してしまう（Nodeで`init()`を2回同時に呼び、`gc()`後に`make_set`して再現確認）。`main.tsx`で`init()`を1回だけ呼び、終わってから`render`するようにして解消
  - [x] ボタンのクリックのたびにページがリロードされ、`make_set`が毎回`true`になった。原因は`<form>`の中の`<button>`が`type`未指定で`submit`扱いになり、フォーム送信でリロードされてタブ内の`Ufdb`が作り直されていたこと。`type="button"`で解消。SidePanelのフォームを`make_set`につなぐときは`onSubmit`で`e.preventDefault()`する
  - [ ] `groups`を公開する。wasm-bindgenは`Vec<Vec<String>>`（入れ子のVec）を返せないため、`serde-wasm-bindgen`で`JsValue`に変換して返す予定。`#[wasm_bindgen(unchecked_return_type = "string[][]")]`を付けると`.d.ts`が`any`ではなく`string[][]`になる（2026-09-28、スクラッチのcrateで確認。`Vec<Vec<String>>`を直接返すと`String: ErasableGeneric`が満たされずコンパイルエラー）。並び順はStudioの`groups`コマンドと揃える（各グループ内を昇順、グループはサイズの降順）。`ufodb_v0::Ufdb::groups()`は`&mut self`なので、ラッパーも`&mut self`で受ける（`self`で受けるとJS側のオブジェクトが呼び出しで消費される）
- [ ] 公開URLで`make_set`/`groups`が動くことを確認する
  - [x] `make_set`: git依存の`ufodb_v0`でCIのビルドが通り、Pages上で1回目`true`・2回目`false`になることを確認（2026-09-27、`da866a6`）
  - [ ] `groups`
- [ ] 残りの操作（`unite`/`same`/`size`/`unmerge`など、Studioの`#[tauri::command]`と同じ粒度）を公開する

## Phase 4: 画面を組み立てる

`ufodb-design-system`に本物のコンポーネント（`Header`・グループ一覧・`SidePanel`）が揃ってきたら、それを使って画面を組み立て、Phase 3のWASMの呼び出しにつなぐ。

- [ ] テンプレート由来のファイルを整理しておく（Phase 1の最後の項目）
- [ ] `Header`を取り込む。design_system側で`main`にマージ済み（`efca889`）なので、`pnpm update ufodb-design-system`で取り込む（lockfileの参照先が`636a111`から更新されることを確認し、lockfileをコミットする）
  - `isSidebarOpen`・`onToggleSidebar`が必須props。サイドパネルはまだ無いので、当面は`useState<boolean>`で開閉状態だけ持つ
  - ロゴ・タイトルがdesign_system側で固定のうちは、Playgroundではロゴが404になる（`/app-icon.svg`が`base`を無視した絶対パスで、Playgroundの`public/`にも無い）。design_system側でpropsにしてもらってから、`import.meta.env.BASE_URL`付きのパスを渡す
- [ ] Studioの画面と見比べて、同じ見た目・同じ操作感になっているか確認する。差がある場合は、Playground側で直さず`ufodb-design-system`側で直す
- [ ] design_system側の変更を取り込むときは、design_system側で`main`にマージしてから、こちらで`pnpm update ufodb-design-system`を実行してlockfileをコミットする。マージ前の変更を試したいときだけ、一時的に`link:../design_system`に切り替える（下の「メモ」参照）

## メモ: `link:`で一時的に参照するとき

design_systemの`main`にまだマージしていない変更をPlaygroundで試したいときは、`package.json`を一時的に`"ufodb-design-system": "link:../design_system"`に書き換える。

- `link:`だと、ライブラリ内の`import "react"`が`design_system/node_modules/react`を読みにいき、Reactが二重に読み込まれてhooksが壊れることがある。その場合は`vite.config.ts`に`resolve.dedupe: ["react", "react-dom"]`を入れる
- design_system側で`pnpm build`しないと`dist/`が更新されず、変更が反映されない
- 試し終わったら`github:`に戻し、`pnpm install`してlockfileの差分が残っていないことを確認する

## 検討事項（未定）

- 状態管理（操作のたびに`groups`を取り直す処理など）をStudioと共通化するかは、`ufodb-design-system`側ROADMAPのPhase 4で決める
