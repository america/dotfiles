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
  use {
    'nvim-treesitter/nvim-treesitter',
    run = ':TSUpdate',
    config = function()
        require'nvim-treesitter.configs'.setup {
            ensure_installed = { "html", "go" }, -- 必要な言語をインストール
            highlight = {
                enable = true, -- ハイライトを有効化
                additional_vim_regex_highlighting = false,
            },
        }
    end
  }
  use 'tpope/vim-fugitive'
  use 'nvim-lualine/lualine.nvim'
  use {'akinsho/bufferline.nvim', requires = 'nvim-tree/nvim-web-devicons'}
  use 'plasticboy/vim-markdown'
  use 'godlygeek/tabular'
  use 'morhetz/gruvbox' -- Gruvbox
  use 'joshdick/onedark.vim' -- OneDark
  use 'altercation/vim-colors-solarized' --Solarized
  use {
    "zbirenbaum/copilot.lua",
    cmd = "Copilot",
    event = "InsertEnter",
    config = function()
      require("copilot").setup({
        suggestion = { enabled = false },
        panel = { enabled = false },
      })
    end,
  }

  use {
    "CopilotC-Nvim/CopilotChat.nvim",
    branch = "main",
    requires = {
      "zbirenbaum/copilot.lua",
      "nvim-lua/plenary.nvim",
    },
    config = function()
      require("CopilotChat").setup()
    end,
  }
end)
