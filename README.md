# libxr_web_demo

在浏览器中运行 LibXR 终端的 WebAssembly 示例 / WebAssembly demo that runs a LibXR terminal in the browser

## 1. 内容与平台 / Contents and Platform

示例把 LibXR 编译为 WebAssembly（`LIBXR_SYSTEM` 与 `LIBXR_DRIVER` 均为 `WebAsm`），在网页中运行。`main.cpp` 创建 RamFS 和 `LibXR::Terminal`，注册命令 `led`（`led on` 和 `led off` 通过 `Module.set_led` 切换页面上的 LED），启动时输出各级日志。页面上的按键调用导出函数 `button_click`，键盘输入经 `receive_input` 送入终端。终端由 xterm.js（`third_party/xterm/`）显示，页面布局由 `inject.js`（中文）和 `inject_en.js`（英文）注入。同一份 `main.cpp` 构建出 `index.html`（中文）和 `index_en.html`（英文）两个页面。LibXR 是 `libxr/` 下的 Git 子模块，地址为 `https://github.com/xrobot-org/libxr.git`，所用版本由提交记录固定。

The demo compiles LibXR to WebAssembly (`LIBXR_SYSTEM` and `LIBXR_DRIVER` are both `WebAsm`) and runs it in a web page. `main.cpp` creates a RamFS and a `LibXR::Terminal`, registers the command `led` (`led on` and `led off` switch the LED on the page through `Module.set_led`) and prints log messages of every level at start-up. The button on the page calls the exported function `button_click`, and keyboard input reaches the terminal through `receive_input`. The terminal is displayed by xterm.js (`third_party/xterm/`), and the page layout is injected by `inject.js` (Chinese) and `inject_en.js` (English). The same `main.cpp` builds the two pages `index.html` (Chinese) and `index_en.html` (English). LibXR is the Git submodule `libxr/` at `https://github.com/xrobot-org/libxr.git`, and the commit record pins the version in use.

## 2. 构建 / Build

构建使用 Emscripten 的 `emcmake` 和 `emmake`，镜像 `emscripten/emsdk:latest` 提供工具链。

```bash
git clone --recursive https://github.com/xrobot-org/libxr_web_demo.git
cd libxr_web_demo
docker run --rm -v "$PWD:/src" -w /src emscripten/emsdk:latest \
  bash -c 'mkdir -p build && cd build && emcmake cmake .. && emmake make'
```

`build/` 中生成 `index.html`、`index.js`、`index.wasm`、`index_en.html`、`index_en.js`、`index_en.wasm` 和 `xterm.css`。已克隆但未带子模块时，运行 `git submodule update --init` 获取 LibXR。在 `build/` 中运行 `python3 -m http.server`，用浏览器打开 `http://localhost:8000/index.html` 即可预览。

The build uses `emcmake` and `emmake` from Emscripten, and the image `emscripten/emsdk:latest` provides the toolchain.

`build/` receives `index.html`, `index.js`, `index.wasm`, `index_en.html`, `index_en.js`, `index_en.wasm` and `xterm.css`. For a clone made without submodules, `git submodule update --init` fetches LibXR. Running `python3 -m http.server` in `build/` and opening `http://localhost:8000/index.html` in a browser previews the page.

## 3. 部署 / Deployment

`.github/workflows/build.yml` 在上述镜像中递归检出子模块并构建，对 `master` 和 `dev` 的推送以及指向它们的 PR 都会构建。每次构建都把 `build/` 作为 GitHub Pages 制品上传；推送到 `master` 或在 `master` 上手动运行工作流时，`deploy` 作业发布该制品。

`.github/workflows/build.yml` checks out the submodules recursively and builds in the image above, for pushes to `master` and `dev` and for pull requests targeting them. Every build uploads `build/` as the GitHub Pages artifact; on a push to `master` or a manual run on `master`, the `deploy` job publishes that artifact.

本仓库以 Apache-2.0 发布，见 [LICENSE](LICENSE)；`third_party/xterm/` 中的 xterm.js 与 fit 插件保留各自的 MIT 许可声明。

This repository is released under Apache-2.0, see [LICENSE](LICENSE); xterm.js and the fit addon in `third_party/xterm/` keep their MIT license notices.
