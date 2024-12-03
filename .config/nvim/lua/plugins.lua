vim.cmd [[packadd packer.nvim]]

return require('packer').startup(function(use)
  -- Packer自体の管理
  use 'wbthomason/packer.nvim'

  -- LSP設定、オートコンプリートなど
  use 'neovim/nvim-lspconfig'
  use 'hrsh7th/nvim-cmp'
  use 'hrsh7th/cmp-nvim-lsp'
  use 'hrsh7th/cmp-buffer'
  use 'hrsh7th/cmp-path'
  use 'hrsh7th/cmp-vsnip'
  use 'hrsh7th/vim-vsnip'
  use 'kyazdani42/nvim-web-devicons'
  use 'nvim-treesitter/nvim-treesitter'
  use 'tpope/vim-fugitive'
  use 'nvim-lualine/lualine.nvim'
  use {'akinsho/bufferline.nvim', requires = 'nvim-tree/nvim-web-devicons'}
  use 'plasticboy/vim-markdown'
  use 'godlygeek/tabular'
end)
