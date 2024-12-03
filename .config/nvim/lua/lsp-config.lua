local lspconfig = require('lspconfig')

-- 汎用関数: キー設定を簡略化
local function on_attach(client, bufnr)
  local buf_map = vim.api.nvim_buf_set_keymap

  buf_map(bufnr, 'n', 'gd', '<cmd>lua vim.lsp.buf.definition()<CR>', { noremap = true, silent = true })
  buf_map(bufnr, 'n', 'gr', '<cmd>lua vim.lsp.buf.references()<CR>', { noremap = true, silent = true })
  buf_map(bufnr, 'n', 'K', '<cmd>lua vim.lsp.buf.hover()<CR>', { noremap = true, silent = true })
  buf_map(bufnr, 'n', '<leader>rn', '<cmd>lua vim.lsp.buf.rename()<CR>', { noremap = true, silent = true })
end

-- PythonのLSP設定
lspconfig.pyright.setup({
  on_attach = on_attach,
})

-- TypeScriptのLSP設定
lspconfig.ts_ls.setup({
  on_attach = on_attach,
})

-- C++のLSP設定
lspconfig.clangd.setup({
    cmd = { "clangd", "--background-index" },
    filetypes = { "c", "cpp", "cc", "cxx", "objc", "objcpp" },
    root_dir = lspconfig.util.root_pattern("compile_commands.json", "compile_flags.txt", ".git"),
    on_attach = on_attach,
})

-- DenoのLSP設定
lspconfig.denols.setup({
  root_dir = lspconfig.util.root_pattern("deno.json", "deno.jsonc"),
  init_options = {
    enable = true,
    lint = true,
    unstable = true,
  },
  on_attach = on_attach,
})
