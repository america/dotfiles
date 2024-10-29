require('lualine').setup {
    options = {
        theme = 'gruvbox',  -- 好みのテーマを指定
        section_separators = { left = '', right = '' },
        component_separators = { left = '│', right = '│' },
    },
    sections = {
        lualine_a = { 'mode' },
        lualine_b = { 'branch' },
        lualine_c = { 'filename' },
        lualine_x = { 'filetype', 'filesize', 'location' },
        lualine_y = { 'progress' },
        lualine_z = { 'date' }
    },
}

