require('bufferline').setup{
    options = {
        numbers = "both",                      -- 番号表示
        close_command = "bdelete! %d",        -- バッファを閉じるコマンド
        right_mouse_command = "bdelete! %d",  -- 右クリックでバッファを閉じる
        middle_mouse_command = "bdelete! %d", -- 中クリックでバッファを閉じる
        offsets = {{ 
            filetype = "NvimTree",             -- NvimTreeとのオフセットを設定
            text = "File Explorer",
            text_align = "center",
            separator = true,
        }},
        color_icons = true,                    -- アイコンに色を付ける
        show_buffer_close_icons = true,        -- バッファを閉じるアイコンを表示
        show_close_icon = false,                -- 閉じるアイコンを非表示
        show_tab_indicators = true,            -- タブのインジケーターを表示
    }
}

