set nocompatible

filetype plugin indent off

set runtimepath+=~/.vim/bundle/neobundle.vim/
" NeoBundleを初期化
call neobundle#begin(expand('~/.vim/bundle/'))

NeoBundleFetch 'Shougo/neobundle.vim'

NeoBundle 'Shougo/unite.vim'
NeoBundle 'Shougo/unite-outline'
NeoBundle 'Shougo/neosnippet'
NeoBundle 'Shougo/neosnippet-snippets'
NeoBundle 'Shougo/neomru.vim'
NeoBundle 'thinca/vim-quickrun'
NeoBundle 'kana/vim-smartinput'
NeoBundle 'kana/vim-operator-user'
NeoBundle 'kana/vim-textobj-user'
NeoBundle 'kana/vim-operator-replace'
NeoBundle 'rhysd/vim-operator-surround'

" for Python
NeoBundle "scrooloose/syntastic"
NeoBundle 'hynek/vim-python-pep8-indent'
NeoBundle 'jmcantrell/vim-virtualenv'
NeoBundle 'kana/vim-textobj-indent'
NeoBundle 'bps/vim-textobj-python'
NeoBundle "scrooloose/syntastic"
NeoBundle 'Shougo/neocomplete.vim'

" Jedi for python
NeoBundleLazy "davidhalter/jedi-vim", {
    \ "autoload": { "filetypes": [ "python", "python3", "djangohtml"] }}

" solarized カラースキーム
NeoBundle 'altercation/vim-colors-solarized'
" mustang カラースキーム
NeoBundle 'croaker/mustang-vim'
" wombat カラースキーム
NeoBundle 'jeffreyiacono/vim-colors-wombat'
" jellybeans カラースキーム
NeoBundle 'nanotech/jellybeans.vim'
" lucius カラースキーム
NeoBundle 'vim-scripts/Lucius'
" zenburn カラースキーム
NeoBundle 'vim-scripts/Zenburn'
" mrkn256 カラースキーム
NeoBundle 'mrkn/mrkn256.vim'
" railscasts カラースキーム
NeoBundle 'jpo/vim-railscasts-theme'
" pyte カラースキーム
NeoBundle 'therubymug/vim-pyte'
" molokai カラースキーム
NeoBundle 'tomasr/molokai'

" カラースキーム一覧表示に Unite.vim を使う
NeoBundle 'Shougo/unite.vim'
NeoBundle 'ujihisa/unite-colorscheme'

call neobundle#end()

syntax on                               " シンタックスカラーリングオン
filetype plugin indent on

NeoBundleCheck

let mapleader = "\<Space>"
""""""""""""""""""""""""""""""""""
"            vimfiler            "
""""""""""""""""""""""""""""""""""
let g:vimfiler_as_default_explorer = 1

""""""""""""""""""""""""""""""""""
"            unite               "
""""""""""""""""""""""""""""""""""
let g:unite_update_time = 1000

nnoremap <silent> <C-r>  :<C-u>Unite file_mru<CR>
nnoremap <silent> <C-n>  :<C-u>Unite buffer <CR>
nnoremap <silent> <Leader> :<C-u>Unite file<CR>
nnoremap <silent> <C-o>  :<C-u>Unite outline<CR>

""""""""""""""""""""""""""""""""""
"            pathogen            "
""""""""""""""""""""""""""""""""""
execute pathogen#infect()
""""""""""""""""""""""""""""""""""
"            syntastic           "
""""""""""""""""""""""""""""""""""
set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*
let g:syntastic_python_checkers = ['flake8']
let g:syntastic_python_flake8_args="--max-line-length=120"
let g:syntastic_always_populate_loc_list = 1
let g:syntastic_auto_loc_list = 1
let g:syntastic_check_on_open = 1
let g:syntastic_check_on_wq = 0

" Common ---------------------------
set nocompatible                        " be iMproved
" colorscheme jellybeans                  " カラースキームの設定
set background=dark                     " 背景色の傾向(カラースキームがそれに併せて色の明暗を変えてくれる)
set t_Co=256
set fileformats=unix,dos

" Indent -------------------------------
" tabstop:                              Tab文字を画面上で何文字分に展開するか
" shiftwidth:                           cindentやautoindent時に挿入されるインデントの幅
" softtabstop:                          Tabキー押し下げ時の挿入される空白の量，0の場合はtabstopと同じ，BSにも影響する
set tabstop=2
set expandtab
set shiftwidth=2
set softtabstop=2
set smarttab
set virtualedit=block

set autoindent smartindent              " 自動インデント，スマートインデント

" File ---------------------------
set autoread                            " 更新時自動再読込み
set hidden                              " 編集中でも他のファイルを開けるようにする
set noswapfile                          " スワップファイルを作らない
set nobackup                            " バックアップを取らない
autocmd BufWritePre * :%s/\s\+$//ge     " 保存時に行末の空白を除去する

" Assist imputting ---------------------
set backspace=indent,eol,start          " バックスペースで特殊記号も削除可能に
set formatoptions=lmoq                  " 整形オプション，マルチバイト系を追加
set whichwrap=b,s,h,s,<,>,[,]           " カーソルを行頭、行末で止まらないようにする
" set clipboard=unnamed,autoselect       " バッファにクリップボードを利用する

" Complement Command -------------------
set wildmenu                            " コマンド補完を強化
set wildmode=list:full                  " リスト表示，最長マッチ

" Search -------------------------------
set wrapscan                            " 最後まで検索したら先頭へ戻る
set ignorecase                          " 大文字小文字無視
set smartcase                           " 大文字ではじめたら大文字小文字無視しない
set incsearch                           " インクリメンタルサーチ
set hlsearch                            " 検索文字をハイライト
set nohlsearch

" View ---------------------------------
set showmatch                           " 括弧の対応をハイライト
set showcmd                             " 入力中のコマンドを表示
set showmode                            " 現在のモードを表示
set number                              " 行番号表示
" set nowrap                             " 画面幅で折り返さない
set list                                " 不可視文字表示
set listchars=tab:>-,trail:-           " 不可視文字の表示方法
set notitle                             " タイトル書き換えない
set scrolloff=5                         " 行送り
set display=uhex                        " 印字不可能文字を16進数で表示

" 全角スペースの定義
hi ZenkakuSpace gui=underline guibg=DarkBlue cterm=underline ctermfg=LightBlue
match ZenkakuSpace /　/                 " 全角スペースの色を変更

set cursorline                          " カーソル行をハイライト
augroup cch
        autocmd! cch
        autocmd WinLeave * set nocursorline
        autocmd WinEnter,BufRead * set cursorline
augroup END
hi clear CursorLine
hi CursorLine gui=underline
hi CursorLine ctermbg=black guibg=black


" StatusLine ---------------------------
set laststatus=2                        " ステータスラインを2行に

set showtabline=2

" Charset, Line ending -----------------
set termencoding=utf-8
set encoding=utf-8
set fileencodings=utf-8,cp932,euc-jp,iso-2022-jp
set ffs=unix,dos,mac                    " LF, CRLF, CR
if exists('&ambiwidth')
    set ambiwidth=double                " UTF-8の□や○でカーソル位置がずれないようにす
endif

if has('path_extra')
  set tags& tags +=.tags,tags
endif

set clipboard=unnamed

set backspace=eol,indent,start

set wildmenu

set wildmode=list:full

set wildignore=*.o,*.obj,*.pyc,*.so,*.dll

let g:python_highlight_all = 1
