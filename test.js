const { app } = require("electron");

require("./sum.win32-x64-msvc.node").start(module, require);

app && app.quit();
