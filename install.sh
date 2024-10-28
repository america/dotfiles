#!/bin/bash

# Dotfilesのディレクトリパス
DOTFILES_DIR="$HOME/.dotfiles"

# バックアップ用ディレクトリ
BACKUP_DIR="$HOME/dotfiles_backup_$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"

# シンボリックリンクを作成するファイルのリスト
FILES=( ".vimrc" ".zshrc" "config/sway" "config/nvim" )

# 各ファイルの処理
for file in "${FILES[@]}"; do
    # 元のファイルをバックアップ
    if [ -e "$HOME/$file" ]; then
        echo "Backing up $file to $BACKUP_DIR"
        mv "$HOME/$file" "$BACKUP_DIR/"
    fi
    
    # シンボリックリンクの作成
    echo "Creating symlink for $file"
    ln -s "$DOTFILES_DIR/$file" "$HOME/$file"
done

echo "Dotfiles setup complete!"

