#
# Executes commands at the start of an interactive session.
#
# Authors:
#   Sorin Ionescu <sorin.ionescu@gmail.com>
#

# Source Prezto.
if [[ -s "${ZDOTDIR:-$HOME}/.zprezto/init.zsh" ]]; then
  source "${ZDOTDIR:-$HOME}/.zprezto/init.zsh"
fi

# Customize to your needs...

# for Python
export PATH=/usr/bin:$PATH
export PATH=/usr/bin/pyton3.11:$PATH

PATH=$HOME/bin:$PATH

export PATH=$PATH:/usr/local/go/bin

#export GOENV_ROOT="$HOME/.goenv"
#export PATH="$GOENV_ROOT/bin:$PATH"
#eval "$(goenv init -)"
export PATH="$GOROOT/bin:$PATH"
export PATH="$PATH:$GOPATH/bin"

# これによってマウスカーソルが表示されるようになる
export WLR_NO_HARDWARE_CURSORS=1

#xmodmap "$HOME/.Xmodmap"

export PATH=$PATH:~/.local/bin

# for adb
export PATH=$PATH:~/platform-tools

export VISUAL=vi
export EDITOR=vi

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Change global install path to local directory
export PATH=~/.npm-global/bin:$PATH
