require'nvim-treesitter.configs'.setup {
    ensure_installed = { "html", "go", "lua" }, -- 必要な言語を指定
    highlight = {
        enable = true, -- ハイライトを有効化
    },
    indent = {
        enable = true, -- 自動インデント
    },
    incremental_selection = {
        enable = true, -- インクリメンタル選択
        keymaps = {
            init_selection = "gnn",
            node_incremental = "grn",
            scope_incremental = "grc",
            node_decremental = "grm",
        },
    },
    textobjects = { -- テキストオブジェクトのサポート
        select = {
            enable = true,
            lookahead = true,
            keymaps = {
                ["af"] = "@function.outer",
                ["if"] = "@function.inner",
                ["ac"] = "@class.outer",
                ["ic"] = "@class.inner",
            },
        },
    },
}

-- ファイルタイプ`gohtmltmpl`をHTMLとして扱う
vim.filetype.add({
    extension = {
        gohtmltmpl = "html"
    },
})
