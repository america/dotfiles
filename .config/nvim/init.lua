-- Ward off unexpected things that your distro might have made, as
-- well as sanely reset options when re-sourcing .vimrc

-- for xclip
vim.opt.clipboard:append('unnamedplus')
-- Loading external configuration file
vim.cmd('runtime! option.vim')
vim.cmd('runtime! keymap.vim')

-- Loading coc-settings.vim
if vim.fn.has('nvim') == 1 then
  vim.cmd('source ~/.config/nvim/autoload/coc-settings.vim')
  vim.cmd('source ~/.config/nvim/autoload/closed-tabs-managing.vim')
else
  vim.cmd('source ~/.vim/autoload/coc-settings.vim')
  vim.cmd('source ~/.vim/autoload/closed-tabs-managing.vim')
end

-- Attempt to determine the type of a file based on its name and possibly its
-- contents. Use this to allow intelligent auto-indenting for each filetype,
-- and for plugins that are filetype specific.
if vim.fn.has('filetype') == 1 then
  vim.cmd('filetype indent plugin on')
end

if vim.fn.has('syntax') == 1 then
  vim.cmd('syntax on')
end

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
  use 'kyazdani42/nvim-web-devicons'

  use 'nvim-treesitter/nvim-treesitter' -- シンタックスハイライト
  use 'tpope/vim-fugitive'            -- Git管理
  use 'nvim-lualine/lualine.nvim'     -- ステータスライン
  use {'akinsho/bufferline.nvim', requires = 'nvim-tree/nvim-web-devicons'}
  use 'plasticboy/vim-markdown'    -- Markdown syntax highlighting
  use 'godlygeek/tabular'          -- Helps with table formatting

end)

-- プラグインの設定ファイルを読み込み
require('cmp-config')
require('lsp-config')
require('lualine-config')
require('bufferline-config')
