" leaderをスペースに変更
let mapleader = "\<Space>"

" 入力モード中に素早くjjと入力した場合はESCとみなす
inoremap <silent> jj <Esc>:<C-u>w<CR>

" ESCを2回押すことでハイライトを消す
nmap <silent> <Esc><Esc> :nohlsearch<CR>

" ##### ウィンドウ操作系 #####
" 画面をspace+vで縦に分割する
nnoremap <silent> <Leader>v :vs<CR>
" 画面をspace+sで横に分割する
nnoremap <silent> <Leader>s :sp<CR>

" hjklの方向ににカーソルを移動させる
nnoremap <silent> <Leader>h <C-w>h
nnoremap <silent> <Leader>j <C-w>j
nnoremap <silent> <Leader>k <C-w>k
nnoremap <silent> <Leader>l <C-w>l

" ##### 行・列関係 #####

" 文章が画面の右端に到達すると折り返す設定をoption.vimで入れている
" hjklはデフォルトだと、折り返す前の表示で上下左右に移動できる
" つまり、折り返して表示した状態だと直感と実際のhjklの動作が違う
" これを修正するオプションがしたの4つ
nnoremap j gj
nnoremap k gk
vnoremap j gj
vnoremap k gk

" 補完
" tabキーと shift+tabキーで補完候補を選択できる
inoremap <expr><TAB> pumvisible() ? "\<C-n>" : "\<TAB>"
inoremap <expr><S-TAB> pumvisible() ? "\<C-p>" : "\<S-TAB>"

"ノーマルモードで
"スペース2回でCocList
nmap <silent> <space><space> :<C-u>CocList<cr>
"スペースhでHover
nmap <silent> <space>h :<C-u>call CocAction('doHover')<cr>
"スペースdfでDefinition
nmap <silent> <space>df <Plug>(coc-definition)
"スペースrfでReferences
nmap <silent> <space>rf <Plug>(coc-references)
"スペースrnでRename
nmap <silent> <space>rn <Plug>(coc-rename)
"スペースfmtでFormat
nmap <silent> <space>fmt <Plug>(coc-format)

" Tab related key bindings
 noremap <Tab>     <Cmd>tabnext<CR><C-G>
noremap <S-Tab>   <Cmd>tabprevious<CR><C-G>
noremap <C-Right> <Cmd>tabnext<CR><C-G>
noremap <C-Left>  <Cmd>tabprevious<CR><C-G>
noremap <C-Up>    <Cmd>if len(g:most_recently_closed) > 0 \|
                    \   execute ':tabnew ' .. remove(g:most_recently_closed, 0) \|
                    \ endif<CR>
noremap  <C-Down> <Cmd>q<CR><C-G>
noremap  <expr> <C-lt> ':tabmove -' .. v:count1 .. '<CR>'
noremap  <expr> <C->>  ':tabmove +' .. v:count1 .. '<CR>'
nnoremap gr        <Cmd>tabnext<CR><C-G>
nnoremap gR        <Cmd>tabprevious<CR><C-G>

" Close all unchanged tabs and windows
cabbr qa tabdo windo if !&modified \| try \| close \| catch \| quit \| endtry \| endif

" Close open tabs and windows without any questions asked
cabbr qq tabdo windo try \| close \| catch \| quit! \| endtry
