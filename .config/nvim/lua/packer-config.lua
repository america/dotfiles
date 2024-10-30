require('packer').startup(function(use)
    -- ここにプラグインを追加
    use 'wbthomason/packer.nvim'        -- Packer 自体
    use 'neovim/nvim-lspconfig'         -- LSP設定
    use 'hrsh7th/nvim-cmp'              -- オートコンプリート
    use 'hrsh7th/cmp-nvim-lsp'          -- LSPとの連携
    use 'hrsh7th/cmp-buffer'            -- バッファ内の単語補完
    use 'hrsh7th/cmp-path'              -- パス補完
    use 'hrsh7th/cmp-vsnip'             -- スニペット補完
    use 'hrsh7th/vim-vsnip'             -- スニペットエンジン
    use 'nvim-lualine/lualine.nvim'     -- ステータスライン
    use 'akinsho/bufferline.nvim'       -- タブライン
end)

