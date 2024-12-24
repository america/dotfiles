-- 基本オプション設定
vim.opt.number = true                  -- 行番号を表示
vim.opt.relativenumber = true          -- 相対行番号を表示

-- インデント設定
vim.opt.expandtab = true      -- タブをスペースに変換
vim.opt.tabstop = 2           -- タブ文字の幅
vim.opt.shiftwidth = 2        -- 自動インデントの幅
vim.opt.softtabstop = -1      -- softtabstopを無効化（shiftwidthの値を使用）
vim.opt.smartindent = true    -- スマートインデントを有効化

-- ファイルタイプ別のインデント設定
vim.api.nvim_create_autocmd("FileType", {
  pattern = "python",
  callback = function()
    vim.opt_local.tabstop = 4
    vim.opt_local.shiftwidth = 4
  end
})

-- プラグイン設定を読み込む
require('plugins')

-- プラグインの設定ファイルを読み込み
require('cmp-config')                   -- オートコンプリート設定
require('lsp-config')                   -- LSP設定
require('lualine-config')               -- ステータスライン設定
require('bufferline-config')            -- タブライン設定
require('treesitter-config')
require('settings.colors')
require('copilot_config')
require('keymaps')
require('ibl-config')
--('copilot_chat_config.init')

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

-- GiHub Copilot Chatのキーバインディング
--vim.api.nvim_set_keymap('n', '<Leader>gc', ':Copilot<CR>', { noremap = true, silent = true })

if vim.fn.executable("wl-copy") == 1 then
  vim.g.clipboard = {
  name = "wl-clipboard",
  copy = {
    ["+"] = "wl-copy --foreground --type text/plain",
    ["*"] = "wl-copy --foreground --primary --type text/plain",
  },
  paste = {
    ["+"] = function()
      return vim.fn.systemlist('wl-paste --no-newline|sed -e "s/\r$//"', { "" }, 1)
    end,
    ["*"] = function()
      return vim.fn.systemlist('wl-paste --primary --no-newline|sed -e "s/\r$//"', { "" }, 1)
    end,
  },
  cache_enabled = true,
  }
end

vim.opt.clipboard = "unnamedplus"
