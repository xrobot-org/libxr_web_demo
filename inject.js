console.log("inject.js ✅ 启动窗口终端");

(function () {
  function loadCSS(href) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function initTerminal() {
    // 清空页面并设置基础样式
    document.body.innerHTML = "";
    document.body.style = `
      margin: 0;
      padding: 0;
      background: #FFF;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: Consolas, monospace;
    `.trim();

    // 创建窗口外壳
    const wrapper = document.createElement("div");
    wrapper.style = `
      width: 960px;
      height: 100%;
      background: #1e1e1e;
      border-radius: 6px;
      box-shadow: 0 0 40px rgba(0, 0, 0, 0.8);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `.trim();

    // 创建顶部标题栏
    const titleBar = document.createElement("div");
    titleBar.style = `
      height: 40px;
      background: #2d2d2d;
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      font-size: 14px;
      user-select: none;
    `.trim();

    // 左侧控制区域（返回按钮 + 红黄绿按钮）
    const leftControls = document.createElement("div");
    leftControls.style = "display: flex; align-items: center; gap: 12px;";

    const navBtn = document.createElement("button");
    navBtn.textContent = "返回首页";
    navBtn.style = `
      background: transparent;
      border: 1px solid #666;
      color: white;
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
    `;
    navBtn.onmouseenter = () => navBtn.style.background = "#444";
    navBtn.onmouseleave = () => navBtn.style.background = "transparent";
    navBtn.onclick = () => {
      window.location.href = "https://xrobot-org.github.io/";
    };

    const buttonWrap = document.createElement("div");
    buttonWrap.style = "display: flex; gap: 8px;";
    ["#ff5f56", "#ffbd2e", "#27c93f"].forEach(color => {
      const btn = document.createElement("span");
      btn.style = `
        width: 12px;
        height: 12px;
        background: ${color};
        border-radius: 50%;
        display: inline-block;
      `;
      buttonWrap.appendChild(btn);
    });

    leftControls.appendChild(navBtn);
    leftControls.appendChild(buttonWrap);

    const titleText = document.createElement("div");
    titleText.textContent = "XRobot Web Terminal";

    titleBar.appendChild(leftControls);
    titleBar.appendChild(titleText);

    // 创建终端容器
    const container = document.createElement("div");
    container.id = "terminal";
    container.style = `
      flex: 1;
      background: black;
    `.trim();

    // 创建底部控制区（按键 + LED）
    const controlPanel = document.createElement("div");
    controlPanel.style = `
      height: 60px;
      background: #121212;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 40px;
      border-top: 1px solid #333;
    `;

    const button = document.createElement("button");
    button.textContent = "Button";
    button.style = `
      padding: 8px 20px;
      font-size: 14px;
      background: #444;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;
    button.onmouseenter = () => button.style.background = "#666";
    button.onmouseleave = () => button.style.background = "#444";
    button.onclick = () => {
      if (Module.ccall) {
        Module.ccall("button_click", null, [], []);
      }
    };

    const led = document.createElement("div");
    led.style = `
      width: 16px;
      height: 16px;
      background: red;
      border-radius: 50%;
      box-shadow: 0 0 6px red;
    `;

    Module.set_led = function (on) {
      led.style.background = on ? "limegreen" : "red";
      led.style.boxShadow = on ? "0 0 8px lime" : "0 0 6px red";
    };

    controlPanel.appendChild(button);
    controlPanel.appendChild(led);

    // 页脚区域
    const footer = document.createElement("footer");
    footer.style = `
      background: #f5f5f5;
      border-top: 1px solid #ddd;
      font-size: 14px;
      color: #333;
      padding: 24px 32px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 32px;
    `;

    function createFooterColumn(title, items) {
      const col = document.createElement("div");
      col.style = "min-width: 180px;";
      const heading = document.createElement("h4");
      heading.textContent = title;
      heading.style = "margin-bottom: 8px; font-weight: bold;";
      col.appendChild(heading);
      items.forEach(([text, href]) => {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = text;
        link.target = "_blank";
        link.style = `
          display: block;
          margin: 4px 0;
          color: #555;
          text-decoration: none;
        `;
        link.onmouseenter = () => (link.style.color = "#000");
        link.onmouseleave = () => (link.style.color = "#555");
        col.appendChild(link);
      });
      return col;
    }

    document.title = "XRobot Web Terminal";

    const columns = [
      ["文档", [
        ["入门", "https://xrobot-org.github.io/"],
        ["LibXR 类文档 ↗", "https://jiu-xiao.github.io/libxr/"],
        ["CodeGenerator命令行工具 ↗", "https://pypi.org/project/libxr/"],
        ["XRobot命令行工具 ↗", "https://pypi.org/project/xrobot/"],
      ]],
      ["社区", [
        ["GitHub仓库 ↗", "https://github.com/xrobot-org"],
        ["LibXR ↗", "https://github.com/Jiu-xiao/libxr"],
        ["CodeGenerator ↗", "https://github.com/Jiu-xiao/LibXR_CppCodeGenerator"],
        ["QDU Robomaster未来战队 ↗", "https://github.com/QDU-Robomaster"],
      ]],
      ["媒体", [
        ["Bilibili视频教程 ↗", "https://space.bilibili.com/339766655/lists"],
        ["未来战队B站频道 ↗", "https://space.bilibili.com/1309383975"],
      ]],
      ["联系方式", [
        ["邮箱 ↗", "mailto:Cong.Liu_Xiao@outlook.com"],
        ["QQ群: 608182228 ↗", "https://qm.qq.com/q/RPgE71OXmw"],
      ]],
    ];

    columns.forEach(([title, items]) => {
      footer.appendChild(createFooterColumn(title, items));
    });

    const copyright = document.createElement("div");
    copyright.style = `
      width: 100%;
      text-align: center;
      font-size: 12px;
      color: #888;
      margin-top: 16px;
    `;
    copyright.innerHTML = `Copyright © 2025 XRobot`;
    footer.appendChild(copyright);

    // 组装页面
    wrapper.appendChild(titleBar);
    wrapper.appendChild(container);
    wrapper.appendChild(controlPanel);
    wrapper.appendChild(footer);
    document.body.appendChild(wrapper);

    // 隐藏滚动条
    const style = document.createElement("style");
    style.innerHTML = `
      .xterm-viewport {
        overflow-x: hidden !important;
        overflow-y: hidden !important;
      }
      ::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
        display: none;
      }
    `;
    document.head.appendChild(style);

    // 初始化终端
    const term = new Terminal({
      convertEol: true,
      fontFamily: 'Consolas, monospace',
      fontSize: 14,
      lineHeight: 1.2,
      theme: {
        background: '#000000',
        foreground: '#c0c0c0',
        cursor: '#00ff00'
      }
    });

    const fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);
    term.open(container);
    fitAddon.fit();
    window.addEventListener("resize", () => fitAddon.fit());

    // WASM 回调接口
    window.Module = window.Module || {};
    Module.put_char = ch => term.write(ch);
    Module.put_chars = str => term.write(str);

    term.onData(data => {
      if (Module.ccall) {
        Module.ccall("receive_input", null, ["string"], [data]);
      }
    });

    term.write("\x1b[1;36m[ New Terminal Initialized ]\x1b[0m\r\n");
  }

  loadCSS("xterm.css");

  if (typeof Module !== "undefined" && Module.calledRun) {
    initTerminal();
  } else {
    const oldInit = Module.onRuntimeInitialized;
    Module.onRuntimeInitialized = function () {
      if (typeof oldInit === "function") oldInit();
      initTerminal();
    };
  }
})();
