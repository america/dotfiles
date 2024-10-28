# dotfiles

[![Release](https://img.shields.io/github/v/release/america/dotfiles.git?label=release)](https://github.com/username/repo/releases)
[![License](https://img.shields.io/github/license/amrica/dotfiles.git)](LICENSE)

## Dotfiles for a Custom Development Environment

This repository contains my personal configuration files (dotfiles) for setting up a development environment. These configurations are optimized for productivity, simplicity, and customization.

---

### Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Installation](#installation)
   - [Prerequisites](#prerequisites)
   - [Automatic Installation](#automatic-installation)
   - [Manual Installation](#manual-installation)
4. [Configuration Details](#configuration-details)
   - [.vimrc](#vimrc)
   - [.zshrc (Prezto)](#zshrc-prezto)
   - [Sway](#sway)
   - [Neovim](#neovim)
5. [Customization](#customization)
6. [Recommended Plugins & Tools](#recommended-plugins--tools)
7. [Troubleshooting](#troubleshooting)
8. [License](#license)

---

### Overview

This repository is a collection of dotfiles to streamline development with consistent configurations across different machines. It includes:

- Terminal and shell customizations
- Text editor configurations
- Window manager settings
- Development environment settings

---

### Directory Structure

The dotfiles are organized as follows:

```plaintext
dotfiles/
├── .vimrc                   # Vim configuration file
├── .zshrc                   # Zsh shell configuration (using Prezto)
├── config/
│   ├── sway/                # Sway window manager configuration
│   └── nvim/                # Neovim configuration files
└── install.sh               # Script to symlink and set up dotfiles
```

---

### Installation

#### Prerequisites

- **Git** for cloning this repository.
- **Neovim**, **Zsh**, **Prezto**, **Sway** (or any tools related to these configurations) should be installed on your machine.
- A compatible terminal emulator (e.g., Alacritty, Kitty) that supports the listed settings.

#### Automatic Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/america/dotfiles.git ~/.dotfiles
   ```

2. **Run the Installation Script**: This script will create symbolic links to your home directory.

   ```bash
   cd ~/.dotfiles
   ./install.sh
   ```

   This script will back up any existing dotfiles in your home directory to avoid overwriting them.

#### Manual Installation

For more control, manually create symlinks for each configuration file:

```bash
ln -s ~/.dotfiles/.vimrc ~/.vimrc
ln -s ~/.dotfiles/.zshrc ~/.zshrc
ln -s ~/.dotfiles/config/sway ~/.config/sway
ln -s ~/.dotfiles/config/nvim ~/.config/nvim
```

---

### Configuration Details

#### .vimrc

- **Plugins**: Uses [vim-plug](https://github.com/junegunn/vim-plug) to manage plugins.
- **Color Scheme**: Solarized (changeable in the config).
- **Mappings**: Custom keybindings for productivity (e.g., `<leader>w` to save files).
- **Customization**: Adjust any specific plugins or mappings to fit your workflow.

#### .zshrc (Prezto)

- **Prezto Framework**: Uses [Prezto](https://github.com/sorin-ionescu/prezto) for managing Zsh configurations, providing optimized performance and modular configuration.
- **Aliases**: Includes custom aliases for common commands (e.g., `ll` for `ls -la`).
- **Prompt**: Minimal prompt with git branch indication, customizable through Prezto's prompt module.
- **Theme**: Prezto's robust theme support allows for easy theme switching and customization.
- **Modules**: Prezto modules such as `history`, `syntax-highlighting`, and `autosuggestions` enhance shell productivity.

#### Sway (config/sway/config)

- **Workspaces**: Predefined workspace names and layouts for organized workflows.
- **Keybindings**: Custom shortcuts for launching applications, moving windows, and adjusting layouts.
- **Appearance**: Adjusted fonts, colors, and window borders for a clean aesthetic.

#### Neovim (config/nvim/init.lua)

- **Plugin Manager**: [Packer.nvim](https://github.com/wbthomason/packer.nvim) for flexible plugin management.
- **Syntax Highlighting**: Uses Tree-sitter for modern syntax highlighting.
- **LSP Configurations**: Pre-configured LSP settings for languages like Python, JavaScript, and C++.
- **Autocompletion**: Integrated with nvim-cmp and luasnip for snippet and autocompletion support.

---

### Customization

Feel free to edit these dotfiles to match your personal preferences. Here are some common areas to customize:

- **Aliases and Functions** (`.zshrc`): Add or modify aliases to create shortcuts for your most-used commands.
- **Color Schemes** (`.vimrc` and init.lua): Switch between themes by adjusting the relevant settings.
- **Workspace Layouts** (Sway config): Define specific workspace names, layouts, and window behaviors to fit your screen setup.

---

### Recommended Plugins & Tools

1. **Vim/Neovim Plugins**
   - `tpope/vim-fugitive` for Git integration
   - `junegunn/fzf.vim` for fuzzy file finding
   - `neovim/nvim-lspconfig` for language server support

2. **Zsh Plugins for Prezto**
   - [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting)
   - [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)

3. **Sway Add-ons**
   - [Waybar](https://github.com/Alexays/Waybar) for a customizable status bar.

---

### Troubleshooting

1. **Permissions Issues**: If any files have incorrect permissions, use `chmod` to set appropriate permissions.
2. **Missing Dependencies**: Ensure any required dependencies are installed, especially for plugins or themes.
3. **Symbolic Link Conflicts**: Remove existing configurations or back them up before creating symlinks.

---

### License

This repository is licensed under the MIT License. See `LICENSE` for details.
