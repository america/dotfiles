# Set up the prompt
autoload -Uz promptinit
promptinit
prompt adam1

# Use emacs keybindings even if our EDITOR is set to vi
bindkey -v

## Command history configuration
#
HISTSIZE=10000
SAVEHIST=10000
HISTFILE=~/.zsh_history

setopt histignorealldups sharehistory

# Use modern completion system
autoload -Uz compinit
compinit

#setopt auto_pushd
setopt correct
setopt auto_cd

autoload predict-on
predict-on

export LANG=ja_JP.UTF-8

## Alias configuration
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

alias vi="vim"

alias python="python3"
alias pip="pip3.5"

# set terminal title including current directory
#
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

# core dump configuration
#
ulimit -c unlimited

# set PATH for clojure
export PATH=$PATH:$HOME/bin

# for homebrew
export PATH=/usr/local/bin:$PATH

# for PHP
#export PATH=/home/takashi/tmp/usr/bin:$PATH

## load user .zshrc configuration file
#
[ -f ~/.zshrc.mine ] && source ~/.zshrc.mine

export PATH="$HOME/.anyenv/bin:$PATH"
eval "$(anyenv init -)"

#export PATH="$HOME/.rbenv/bin:$HOME/.phpenv/bin:$PATH"
#export $HOME/.phpenv/bin:$PATH"

#eval "$(rbenv init -)"
#eval "$(phpenv init -)"

#export PYENV_ROOT=$HOME/.pyenv
#export PATH=$PYENV_ROOT/bin:$PATH
#eval "$(pyenv init -)"
#eval "$(pyenv virtualenv-init -)"
