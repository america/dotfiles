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

export GOENV_ROOT="$HOME/.goenv"
export PATH="$GOENV_ROOT/bin:$PATH"
eval "$(goenv init -)"
export PATH="$GOROOT/bin:$PATH"
export PATH="$PATH:$GOPATH/bin"

# これによってマウスカーソルが表示されるようになる
export WLR_NO_HARDWARE_CURSORS=1

#xmodmap "$HOME/.Xmodmap"

export PATH=$PATH:~/.local/bin

# CUDA_HOME
export CUDA_HOME=/opt/cuda

#/usr/bin/xset s off -dpms

# for google-chrome
export PATH="$PATH:/opt/google/chrome"

# for adb
export PATH=$PATH:~/platform-tools

export EDITOR=vim

alias vi='nvim'

# WirePlumber debug log 
#export WIREPLUMBER_DEBUG=3 pipewire > pipewire_debug.log 2>&1 
export WIREPLUMBER_DEBUG=3

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# for chromium
export PATH="${HOME}/repos/depot_tools:$PATH"

# for fcitx5
export GTK_IM_MODULE=fcitx5
export QT_IM_MODULE=fcitx5
export XMODIFIERS="@im=fcitx5"
#export SDL_IM_MODULE=fcitx5
#export WAYLAND_DISPLAY=wayland-0
export _JAVA_OPTIONS='-Dawt.useSystemAAFontSettings=on -Dswing.aatext=true'
#export MOZ_ENABLE_WAYLAND=1

