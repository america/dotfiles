vim.opt.clipboard:append('unnamedplus')

-- 基本オプション設定
vim.opt.number = true                  -- 行番号を表示
vim.opt.relativenumber = true          -- 相対行番号を表示

-- プラグイン設定を読み込む
require('plugins')

-- その他の設定を読み込む
require('cmp-config')
require('lsp-config')
require('lualine-config')
require('bufferline-config')

-- プラグインの設定ファイルを読み込み
require('cmp-config')                   -- オートコンプリート設定
require('lsp-config')                   -- LSP設定
require('lualine-config')               -- ステータスライン設定
require('bufferline-config')            -- タブライン設定

-- 自動バックアップ設定
vim.opt.backup = true                -- バックアップを有効にする
vim.opt.backupdir = vim.fn.expand('~/.config/nvim/backup//')  -- バックアップファイルの保存先
vim.opt.undofile = true               -- Undoファイルを保存する
vim.opt.undodir = vim.fn.expand('~/.config/nvim/undo//')      -- Undoファイルの保存先

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

-- Tab関連のキーバインディング
vim.api.nvim_set_keymap('n', '<Tab>', '<Cmd>tabnext<CR><C-G>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<S-Tab>', '<Cmd>tabprevious<CR><C-G>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<C-Right>', '<Cmd>tabnext<CR><C-G>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<C-Left>', '<Cmd>tabprevious<CR><C-G>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<C-Up>', '<Cmd>if len(g:most_recently_closed) > 0 | execute ":tabnew " .. remove(g:most_recently_closed, 0) | endif<CR>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<C-Down>', '<Cmd>q<CR><C-G>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<C-lt>', ':tabmove -' .. vim.v.count1 .. '<CR>', { noremap = true, expr = true })
vim.api.nvim_set_keymap('n', '<C->>', ':tabmove +' .. vim.v.count1 .. '<CR>', { noremap = true, expr = true })
vim.api.nvim_set_keymap('n', 'gr', '<Cmd>tabnext<CR><C-G>', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', 'gR', '<Cmd>tabprevious<CR><C-G>', { noremap = true, silent = true })

-- 変更されていないタブとウィンドウをすべて閉じる
--vim.cmd [[ cabbr qa tabdo windo if !&modified | try | close | catch | quit | endtry | endif ]]
-- 確認なしで開いているタブとウィンドウを閉じる
--vim.cmd [[ cabbr qq tabdo windo try | close | catch | quit! | endtry ]]
