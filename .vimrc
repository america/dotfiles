if has('vim_starting')
    set runtimepath+=~/.vim/bundle/neobundle.vim
    call neobundle#rc(expand('~/.vim/bundle/'))
endif

NeoBundleFetch 'Shougo/neobundle.vim'

NeoBundle 'Shougo/unite.vim'
NeoBundle 'Shougo/neomru.vim'

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

""""""""""""""""""""""""""""""""""
"            vimfiler            "
""""""""""""""""""""""""""""""""""

let g:vimfiler_as_default_explorer = 1

""""""""""""""""""""""""""""""""""
"             unite              "
""""""""""""""""""""""""""""""""""

let g:unite_update_time = 1000

nnoremap <silent> <C-r>  :<C-u>Unite file_mru<CR>
nnoremap <silent> <C-n>  :<C-u>Unite buffer <CR>
nnoremap <silent> <Leader>d :<C-u>Unite file<CR>

" Common ---------------------------
set nocompatible                        " be iMproved
colorscheme jellybeans                  " カラースキームの設定
set background=light                    " 背景色の傾向(カラースキームがそれに併せて色の明暗を変えてくれる)

" Indent -------------------------------
" tabstop:                              Tab文字を画面上で何文字分に展開するか
" shiftwidth:                           cindentやautoindent時に挿入されるインデントの幅
" softtabstop:                          Tabキー押し下げ時の挿入される空白の量，0の場合はtabstopと同じ，BSにも影響する
set tabstop=2
set expandtab
set shiftwidth=2
set softtabstop=2

set autoindent smartindent              " 自動インデント，スマートインデント

" File ---------------------------
set autoread                            " 更新時自動再読込み
set hidden                              " 編集中でも他のファイルを開けるようにする
set noswapfile                          " スワップファイルを作らない
set nobackup                            " バックアップを取らない
autocmd BufWritePre * :%s/\s\+$//ge     " 保存時に行末の空白を除去する
syntax on                               " シンタックスカラーリングオン

" Assist imputting ---------------------
set backspace=indent,eol,start          " バックスペースで特殊記号も削除可能に
set formatoptions=lmoq                  " 整形オプション，マルチバイト系を追加
set whichwrap=b,s,h,s,<,>,[,]           " カーソルを行頭、行末で止まらないようにする
"set clipboard=unnamed,autoselect       " バッファにクリップボードを利用する

" Complement Command -------------------
set wildmenu                            " コマンド補完を強化
set wildmode=list:full                  " リスト表示，最長マッチ

" Search -------------------------------
set wrapscan                            " 最後まで検索したら先頭へ戻る
set ignorecase                          " 大文字小文字無視
set smartcase                           " 大文字ではじめたら大文字小文字無視しない
set incsearch                           " インクリメンタルサーチ
set hlsearch                            " 検索文字をハイライト

" View ---------------------------------
set showmatch                           " 括弧の対応をハイライト
set showcmd                             " 入力中のコマンドを表示
set showmode                            " 現在のモードを表示
set number                              " 行番号表示
"set nowrap                             " 画面幅で折り返さない
set list                                " 不可視文字表示
set listchars=tab:>\                    " 不可視文字の表示方法
set notitle                             " タイトル書き換えない
set scrolloff=5                         " 行送り
set display=uhex                        " 印字不可能文字を16進数で表示

hi ZenkakuSpace gui=underline guibg=DarkBlue cterm=underline ctermfg=LightBlue " 全角スペースの定義
match ZenkakuSpace /　/                 " 全角スペースの色を変更

set cursorline                          " カーソル行をハイライト
augroup cch
        autocmd! cch
        autocmd WinLeave * set nocursorline
        autocmd WinEnter,BufRead * set cursorline
augroup END
:hi clear CursorLine
:hi CursorLine gui=underline
hi CursorLine ctermbg=black guibg=black


" StatusLine ---------------------------
set laststatus=2                        " ステータスラインを2行に
set statusline=%<%f\ #%n%m%r%h%w%{'['.(&fenc!=''?&fenc:&enc).']['.&ff.']'}%y%=%l,%c%V%8P

" Charset, Line ending -----------------
set termencoding=utf-8
set encoding=utf-8
set fileencodings=utf-8,cp932,euc-jp,iso-2022-jp
set ffs=unix,dos,mac                    " LF, CRLF, CR
if exists('&ambiwidth')
    set ambiwidth=double                " UTF-8の□や○でカーソル位置がずれないようにする
endif
