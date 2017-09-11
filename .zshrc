# Set up the prompt
autoload -Uz promptinit

# Use emacs keybindings even if our EDITOR is set to vi
bindkey -v

## Command history configuration
HISTSIZE=10000
SAVEHIST=10000
HISTFILE=~/.zsh_history

setopt histignorealldups sharehistory

# Use modern completion system
#autoload -Uz compinit
#compinit

#setopt auto_pushd
setopt correct
setopt auto_cd

autoload predict-on
predict-on

export LANG=ja_JP.UTF-8

########################################################
# Alias configuration
########################################################
#
# expand aliases before completing
#
setopt complete_aliases # aliased ls needs if file/dir completions work

alias where="command -v"
alias j="jobs -l"

case "${OSTYPE}" in
freebsd*|darwin*)
  alias ls="ls -G -w"
  ;;
linux*)
  alias ls="ls --color"
  ;;
esac

alias la="ls -a"
alias lf="ls -F"
alias ll="ls -l"

alias du="du -h"
alias df="df -h"

alias su="su -l"

#alias vi="/usr/local/bin/vim"
export EDITOR=vi

alias python="python3"
alias pip="pip3.5"

# set terminal title including current directory
case "${TERM}" in
kterm*|xterm*)
    precmd() {
        echo -ne "\033]0;${USER}@${HOST%%.*}:${PWD}\007"
    }
  export LSCOLORS=exfxcxdxbxegedabagacad
  export LS_COLORS='di=34:ln=35:so=32:pi=33:ex=31:bd=46;34:cd=43;34:su=41;30:sg=46;30:tw=42;30:ow=43;30'
  zstyle ':completion:*' list-colors \
    'di=34' 'ln=35' 'so=32' 'ex=31' 'bd=46;34' 'cd=43;34'
  ;;
esac

########################################################
# zplug configuration
########################################################
if [[ ! -d ~/.zplug ]];then
  git clone https://github.com/zplug/zplug ~/.zplug
fi

source ~/.zplug/init.zsh

# enhancd config
export ENHANCD_COMMAND=ed
export ENHANCD_FILTER=ENHANCD_FILTER=fzy:fzf:peco

# Vanilla shell
zplug "yous/vanilli.sh"

# Additional completion definitions for Zsh
zplug "zsh-users/zsh-completions"

# Load the theme.
zplug "yous/lime"

# Syntax highlighting bundle. zsh-syntax-highlighting must be loaded after
# excuting compinit command and sourcing other plugins.
zplug "zsh-users/zsh-syntax-highlighting", defer:2

# ZSH port of Fish shell's history search feature
zplug "zsh-users/zsh-history-substring-search", defer:2

# Tracks your most used directories, based on 'frecency'.
zplug "rupa/z", use:"*.sh"

# A next-generation cd command with an interactive filter
zplug "b4b4r07/enhancd", use:init.sh

# This plugin adds many useful aliases and functions.
zplug "plugins/git",   from:oh-my-zsh

# Install plugins if there are plugins that have not been installed
if ! zplug check --verbose; then
  printf "Install? [y/N]: "
    if read -q; then
      echo; zplug install
    fi
fi

# Then, source plugins and add commands to $PATH
zplug load --verbose

# Lime theme settings
export LIME_DIR_DISPLAY_COMPONENTS=2

# Better history searching with arrow keys
if zplug check "zsh-users/zsh-history-substring-search"; then
  bindkey "$terminfo[kcuu1]" history-substring-search-up
  bindkey "$terminfo[kcud1]" history-substring-search-down
fi

# Add color to ls command
export CLICOLOR=1



# プロンプトをbash風にする
PS1="%{$fg[cyan]%}[${USER}@${HOST%%.*} %1~]%(!.#.$)${reset_color} "

# core dump configuration
ulimit -c unlimited

# set PATH for clojure
export PATH=$PATH:$HOME/bin

# for homebrew
export PATH=/usr/local/bin:$PATH

# for Python
export PATH=$HOME/dev/python/Python/.tox/py35/lib/python3.5/site-packages:$HOME/Applications/python3.5/lib/python3.5/site-packages:$HOME/Applications/python3.5/bin:$HOME/Applications/python2.7.12/bin:$PATH

# for TeX
export PATH=/usr/local/texlive/2017/bin/x86_64-linux:$PATH

## load user .zshrc configuration file
[ -f ~/.zshrc.mine ] && source ~/.zshrc.mine
