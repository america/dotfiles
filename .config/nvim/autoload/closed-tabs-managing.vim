nnoremap <leader>p <Cmd>call ShowMostRecentlyClosedTabs()<CR>
noremap  <C-Up>    :if len(g:most_recently_closed) > 0 \|
                     \   execute ':tabnew ' .. remove(g:most_recently_closed, 0) \|
                     \ endif<CR>

if !exists('g:most_recently_closed')
  let g:most_recently_closed = []
endif

augroup MostRecentlyClosedTabs
  autocmd!
  autocmd BufWinLeave * if expand('<amatch>') != '' | call insert(g:most_recently_closed, expand('<amatch>')) | endif
augroup END

function! ShowMostRecentlyClosedTabs() abort
  new
  set bufhidden=hide
  call append(0, g:most_recently_closed)
  $delete
  autocmd WinClosed <buffer> bwipeout!
  nnoremap <buffer> q <Cmd>bwipeout!<CR>
  nnoremap <buffer> <ESC> <Cmd>bwipeout!<CR>
  nnoremap <buffer> dd <Cmd>call remove(g:most_recently_closed, line('.') - 1) | delete<CR>
  nnoremap <buffer> <CR> <Cmd>execute 'tabnew ' .. remove(g:most_recently_closed, line('.') - 1)<CR>
endfunction
