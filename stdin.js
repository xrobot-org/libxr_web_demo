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
            height: 540px;
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
            height: 32px;
            background: #2d2d2d;
            color: white;
            display: flex;
            align-items: center;
            padding: 0 12px;
            font-size: 14px;
            user-select: none;
        `.trim();
        titleBar.innerText = "XRobot Web Terminal";

        // 模拟控制按钮
        const buttonWrap = document.createElement("div");
        buttonWrap.style = `
            display: flex;
            gap: 8px;
            margin-right: 12px;
        `;
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
        titleBar.prepend(buttonWrap);

        // 创建终端容器
        const container = document.createElement("div");
        container.id = "terminal";
        container.style = `
            flex: 1;
            background: black;
        `.trim();

        // 拼接并挂载
        wrapper.appendChild(titleBar);
        wrapper.appendChild(container);
        document.body.appendChild(wrapper);

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

        // 创建模拟按钮
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

        // 创建 LED 指示灯
        const led = document.createElement("div");
        led.style = `
            width: 16px;
            height: 16px;
            background: red;
            border-radius: 50%;
            box-shadow: 0 0 6px red;
        `;

        // 给 Module 添加控制 LED 的方法（可被 C++ 调用）
        Module.set_led = function (on) {
            led.style.background = on ? "limegreen" : "red";
            led.style.boxShadow = on ? "0 0 8px lime" : "0 0 6px red";
        };

        // 添加到控制面板并插入 wrapper
        controlPanel.appendChild(button);
        controlPanel.appendChild(led);
        wrapper.appendChild(controlPanel);


        // 注入隐藏滚动条样式
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

        // Module 接口绑定
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

    // 加载 CSS 并初始化
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
