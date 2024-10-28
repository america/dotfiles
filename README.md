
Dotfiles for a Custom Development Environment
This repository contains my personal configuration files (dotfiles) for setting up a development environment. These configurations are optimized for productivity, simplicity, and customization.

Table of Contents
Overview
Directory Structure
Installation
Prerequisites
Automatic Installation
Manual Installation
Configuration Details
.vimrc
.zshrc
Sway
Neovim
Customization
Recommended Plugins & Tools
Troubleshooting
License
Overview
This repository is a collection of dotfiles to streamline development with consistent configurations across different machines. It includes:

Terminal and shell customizations
Text editor configurations
Window manager settings
Development environment settings
Directory Structure
The dotfiles are organized as follows:

bash
コードをコピーする
dotfiles/
├── .vimrc                   # Vim configuration file
├── .zshrc                   # Zsh shell configuration
├── config/
│   ├── sway/                # Sway window manager configuration
│   └── nvim/                # Neovim configuration files
└── install.sh               # Script to symlink and set up dotfiles
Installation
Prerequisites
Git for cloning this repository.
Neovim, Zsh, Sway (or any tools related to these configurations) should be installed on your machine.
A compatible terminal emulator (e.g., Alacritty, Kitty) that supports the listed settings.
Automatic Installation
Clone the Repository:

bash
コードをコピーする
git clone https://github.com/america/dotfiles.git ~/.dotfiles
Run the Installation Script: This script will create symbolic links to your home directory.

bash
コードをコピーする
cd ~/.dotfiles
./install.sh
This script will back up any existing dotfiles in your home directory to avoid overwriting them.

Manual Installation
For more control, manually create symlinks for each configuration file:

bash
コードをコピーする
ln -s ~/.dotfiles/.vimrc ~/.vimrc
ln -s ~/.dotfiles/.zshrc ~/.zshrc
ln -s ~/.dotfiles/config/sway ~/.config/sway
ln -s ~/.dotfiles/config/nvim ~/.config/nvim
Configuration Details
.vimrc
Plugins: Uses vim-plug to manage plugins.
Color Scheme: Solarized (changeable in the config).
Mappings: Custom keybindings for productivity (e.g., <leader>w to save files).
Customization: Adjust any specific plugins or mappings to fit your workflow.
.zshrc
Aliases: Predefined aliases for common commands (e.g., ll for ls -la).
Prompt: Minimal prompt with git branch indication.
Functions: Custom functions to simplify tasks, such as directory navigation or Git shortcuts.
Theme: Easily switch themes and customize prompts via Prezto's robust theme support.
Sway (config/sway/config)
Workspaces: Predefined workspace names and layouts for organized workflows.
Keybindings: Custom shortcuts for launching applications, moving windows, and adjusting layouts.
Appearance: Adjusted fonts, colors, and window borders for a clean aesthetic.
Neovim (config/nvim/init.lua)
Plugin Manager: Packer.nvim for flexible plugin management.
Syntax Highlighting: Uses Tree-sitter for modern syntax highlighting.
LSP Configurations: Pre-configured LSP settings for languages like Python, JavaScript, and C++.
Autocompletion: Integrated with nvim-cmp and luasnip for snippet and autocompletion support.
Customization
Feel free to edit these dotfiles to match your personal preferences. Here are some common areas to customize:

Aliases and Functions (.zshrc): Add or modify aliases to create shortcuts for your most-used commands.
Color Schemes (.vimrc and init.lua): Switch between themes by adjusting the relevant settings.
Workspace Layouts (Sway config): Define specific workspace names, layouts, and window behaviors to fit your screen setup.
Recommended Plugins & Tools
Vim/Neovim Plugins

tpope/vim-fugitive for Git integration
junegunn/fzf.vim for fuzzy file finding
neovim/nvim-lspconfig for language server support
Zsh Plugins

zsh-syntax-highlighting
zsh-autosuggestions
Sway Add-ons

Waybar for a customizable status bar.
Troubleshooting
Permissions Issues: If any files have incorrect permissions, use chmod to set appropriate permissions.
Missing Dependencies: Ensure any required dependencies are installed, especially for plugins or themes.
Symbolic Link Conflicts: Remove existing configurations or back them up before creating symlinks.
License
This repository is licensed under the MIT License. See LICENSE for details.


