-- 基本設定
vim.opt.number = true                   -- 行番号を表示
vim.opt.relativenumber = true           -- 相対行番号を表示
vim.opt.expandtab = true                 -- タブをスペースに変換
vim.opt.shiftwidth = 4                   -- 自動インデントの幅
vim.opt.tabstop = 4                      -- タブ幅を4に設定

-- 自動バックアップ設定
vim.opt.backup = true                    -- バックアップを有効にする
vim.opt.backupdir = '~/.config/nvim/backup//'  -- バックアップファイルの保存先
vim.opt.undofile = true                   -- Undoファイルを保存する
vim.opt.undodir = '~/.config/nvim/undo//'      -- Undoファイルの保存先

-- プラグインマネージャー設定
vim.cmd [[packadd packer.nvim]]
require('packer').startup(function(use)
  use 'wbthomason/packer.nvim'          -- Packer自体の管理

  -- プラグインの設定
  use 'neovim/nvim-lspconfig'           -- LSP設定
  use 'hrsh7th/nvim-cmp'                -- オートコンプリート
  use 'hrsh7th/cmp-nvim-lsp'            -- LSPとの連携
  use 'hrsh7th/cmp-buffer'              -- バッファ内の単語補完
  use 'hrsh7th/cmp-path'                -- パス補完
  use 'hrsh7th/cmp-vsnip'               -- スニペット補完
  use 'hrsh7th/vim-vsnip'               -- スニペットエンジン
  use 'kyazdani42/nvim-web-devicons'    -- アイコンサポート
  use 'nvim-treesitter/nvim-treesitter' -- シンタックスハイライト
  use 'tpope/vim-fugitive'              -- Git管理
  use 'nvim-lualine/lualine.nvim'       -- ステータスライン
  use {'akinsho/bufferline.nvim', requires = 'nvim-tree/nvim-web-devicons'} -- タブライン
  use 'plasticboy/vim-markdown'         -- Markdown syntax highlighting
  use 'godlygeek/tabular'                -- テーブルフォーマット支援
end)

-- プラグインの設定ファイルを読み込む
require('cmp-config')                   -- オートコンプリート設定
require('lsp-config')                   -- LSP設定
require('lualine-config')               -- ステータスライン設定
require('bufferline-config')             -- タブライン設定

-- ショートカットキー設定
vim.api.nvim_set_keymap('n', '<Tab>', ':BufferLineCycleNext<CR>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<S-Tab>', ':BufferLineCyclePrev<CR>', { noremap = true, silent = true })

-- xclipの設定
vim.opt.clipboard:append('unnamedplus')

-- 外部設定ファイルの読み込み
vim.cmd('runtime! option.vim')
vim.cmd('runtime! keymap.vim')

-- coc-settingsの読み込み
if vim.fn.has('nvim') == 1 then
    vim.cmd('source ~/.config/nvim/autoload/coc-settings.vim')
    vim.cmd('source ~/.config/nvim/autoload/closed-tabs-managing.vim')
else
    vim.cmd('source ~/.vim/autoload/coc-settings.vim')
    vim.cmd('source ~/.vim/autoload/closed-tabs-managing.vim')
end

-- ファイルタイプ設定
if vim.fn.has('filetype') == 1 then
    vim.cmd('filetype indent plugin on')
end

if vim.fn.has('syntax') == 1 then
    vim.cmd('syntax on')
end
