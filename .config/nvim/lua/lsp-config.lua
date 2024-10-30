local lspconfig = require('lspconfig')

-- PythonのLSP設定
lspconfig.pyright.setup{}

-- TypeScriptのLSP設定を tsserver から ts_ls に変更
lspconfig.ts_ls.setup{}

-- C++のLSP設定
lspconfig.clangd.setup{
    cmd = { "clangd", "--background-index" },  -- clangdコマンドのオプションを指定
    filetypes = { "c", "cpp", "cc", "cxx", "objc", "objcpp" },  -- 対応するファイルタイプ
    root_dir = lspconfig.util.root_pattern("compile_commands.json", "compile_flags.txt", ".git"),  -- プロジェクトのルートを決定する条件
}

