-- Ward off unexpected things that your distro might have made, as
-- well as sanely reset options when re-sourcing .vimrc

-- for xclip
vim.opt.clipboard:append('unnamedplus')

-- 基本オプション設定
vim.opt.number = true                  -- 行番号を表示
vim.opt.relativenumber = true          -- 相対行番号を表示

-- Packerの設定
vim.cmd [[packadd packer.nvim]]

require('packer').startup(function(use)
  -- Packer自体の管理
  use 'wbthomason/packer.nvim'

  -- プラグインの例: LSP設定、オートコンプリート、シンタックスハイライト
  use 'neovim/nvim-lspconfig'      -- LSP設定
  use 'hrsh7th/nvim-cmp'           -- オートコンプリート
  use 'hrsh7th/cmp-nvim-lsp'       -- LSPとの連携
  use 'hrsh7th/cmp-buffer'         -- バッファ内の単語補完
  use 'hrsh7th/cmp-path'           -- パス補完
  use 'hrsh7th/cmp-vsnip'          -- スニペット補完（vsnipを使う場合）
  use 'hrsh7th/vim-vsnip'          -- スニペットエンジン
  use 'kyazdani42/nvim-web-devicons' -- アイコン表示用

  use 'nvim-treesitter/nvim-treesitter' -- シンタックスハイライト
  use 'tpope/vim-fugitive'            -- Git管理
  use 'nvim-lualine/lualine.nvim'     -- ステータスライン
  use {'akinsho/bufferline.nvim', requires = 'nvim-tree/nvim-web-devicons'}
  use 'plasticboy/vim-markdown'    -- Markdown syntax highlighting
  use 'godlygeek/tabular'          -- テーブルのフォーマットを助ける
end)

-- プラグインの設定ファイルを読み込み
require('cmp-config')                   -- オートコンプリート設定
require('lsp-config')                   -- LSP設定
require('lualine-config')               -- ステータスライン設定
require('bufferline-config')            -- タブライン設定

-- 自動バックアップ設定
vim.opt.backup = true                -- バックアップを有効にする
vim.opt.backupdir = '~/.config/nvim/backup//'  -- バックアップファイルの保存先
vim.opt.undofile = true               -- Undoファイルを保存する
vim.opt.undodir = '~/.config/nvim/undo//'      -- Undoファイルの保存先

-- キーマッピングの設定
vim.g.mapleader = " " -- leaderをスペースに変更
vim.api.nvim_set_keymap('i', 'jj', '<Esc>:<C-u>w<CR>', { noremap = true, silent = true }) -- 入力モード中に素早くjjと入力した場合はESCとみなす
vim.api.nvim_set_keymap('n', '<Esc><Esc>', ':nohlsearch<CR>', { noremap = true, silent = true }) -- ESCを2回押すことでハイライトを消す

-- ##### ウィンドウ操作系 #####
vim.api.nvim_set_keymap('n', '<Leader>v', ':vs<CR>', { noremap = true, silent = true }) -- 画面をspace+vで縦に分割する
vim.api.nvim_set_keymap('n', '<Leader>s', ':sp<CR>', { noremap = true, silent = true }) -- 画面をspace+sで横に分割する
vim.api.nvim_set_keymap('n', '<Leader>h', '<C-w>h', { noremap = true, silent = true }) -- hjklの方向にカーソルを移動させる
vim.api.nvim_set_keymap('n', '<Leader>j', '<C-w>j', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<Leader>k', '<C-w>k', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<Leader>l', '<C-w>l', { noremap = true, silent = true })

-- ##### 行・列関係 #####
vim.api.nvim_set_keymap('n', 'j', 'gj', { noremap = true, silent = true }) -- hjklの動作を修正
vim.api.nvim_set_keymap('n', 'k', 'gk', { noremap = true, silent = true })
vim.api.nvim_set_keymap('v', 'j', 'gj', { noremap = true, silent = true })
vim.api.nvim_set_keymap('v', 'k', 'gk', { noremap = true, silent = true })

-- 補完
vim.api.nvim_set_keymap('i', '<expr><TAB>', 'pumvisible() ? "<C-n>" : "<TAB>"', { noremap = true, silent = true }) -- 補完候補を選択
vim.api.nvim_set_keymap('i', '<expr><S-TAB>', 'pumvisible() ? "<C-p>" : "<S-TAB>"', { noremap = true, silent = true }) 

-- ノーマルモードでスペース2回でCocList
vim.api.nvim_set_keymap('n', '<space><space>', ':<C-u>CocList<cr>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<space>h', ':<C-u>call CocAction("doHover")<cr>', { noremap = true, silent = true }) -- スペースhでHover
vim.api.nvim_set_keymap('n', '<space>df', '<Plug>(coc-definition)', { noremap = true, silent = true }) -- スペースdfでDefinition
vim.api.nvim_set_keymap('n', '<space>rf', '<Plug>(coc-references)', { noremap = true, silent = true }) -- スペースrfでReferences
vim.api.nvim_set_keymap('n', '<space>rn', '<Plug>(coc-rename)', { noremap = true, silent = true }) -- スペースrnでRename
vim.api.nvim_set_keymap('n', '<space>fmt', '<Plug>(coc-format)', { noremap = true, silent = true }) -- スペースfmtでFormat

-- Tab関連のキーバインディング
vim.api.nvim_set_keymap('n', '<Tab>', '<Cmd>tabnext<CR><C-G>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<S-Tab>', '<Cmd>tabprevious<CR><C-G>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<C-Right>', '<Cmd>tabnext<CR><C-G>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<C-Left>', '<Cmd>tabprevious<CR><C-G>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<C-Up>', '<Cmd>if len(g:most_recently_closed) > 0 | execute ":tabnew " .. remove(g:most_recently_closed, 0) | endif<CR>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<C-Down>', '<Cmd>q<CR><C-G>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<C-lt>', ':tabmove -' .. v.count1 .. '<CR>', { noremap = true, expr = true })
vim.api.nvim_set_keymap('n', '<C->>', ':tabmove +' .. v.count1 .. '<CR>', { noremap = true, expr = true })
vim.api.nvim_set_keymap('n', 'gr', '<Cmd>tabnext<CR><C-G>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', 'gR', '<Cmd>tabprevious<CR><C-G>', { noremap = true, silent = true })

-- 変更されていないタブとウィンドウをすべて閉じる
vim.cmd [[ cabbr qa tabdo windo if !&modified | try | close | catch | quit | endtry | endif ]]
-- 確認なしで開いているタブとウィンドウを閉じる
vim.cmd [[ cabbr qq tabdo windo try | close | catch | quit! | endtry ]]

