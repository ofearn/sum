// 这个文件可以直接用 electron 命令运行。

const fs = require("fs");
const path = require("path");
const { BrowserWindow, app } = require("electron");
const { execSync } = require("child_process");
const { compile } = require("./bytecode");

const isWindow =
  process.platform === "win32" || /^(msys|cygwin)$/.test(process.env.OSTYPE);

function checkOrDownNapiCli(dir) {
  const binPath = path.resolve(dir, "./node_modules/.bin/napi");
  if (!fs.existsSync(binPath)) {
    execSync("npm run install-napi", {
      cwd: dir,
    });
  }
}

async function main() {
  // 输入目录，用于存放待编译的 js bundle
  const inputPath = path.resolve(__dirname);
  const mainBinPath = path.resolve(__dirname, "main.bin");
  // 输出目录，用于存放编译产物，也就是字节码，文件名对应关系：main.js -> main.bin
  // 清理并重新创建输出目录

  // 读取原始 js 并生成字节码
  const mainJs = path.resolve(inputPath, "main.js");

  const code = fs.readFileSync(mainJs);

  fs.writeFileSync(mainBinPath, compile(code));

  app && app.quit();

  // 启动一个浏览器窗口用于渲染进程字节码的编译
  // await launchRenderer();
}

async function launchRenderer() {
  await app.whenReady();

  // const win = new BrowserWindow({
  //   webPreferences: {
  //     // 我们通过 preload 在 renderer 执行 js，这样就不需要一个 html 文件了。
  //     preload: path.resolve(__dirname, './electron-renderer.js'),
  //     enableRemoteModule: true,
  //     nodeIntegration: true,
  //   }
  // });
  // win.loadURL('about:blank');
  // win.show();
}

main();
