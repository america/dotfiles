local opts = { noremap = true, silent = true }

vim.api.nvim_set_keymap('n', '<Leader>ce', '<cmd>CopilotChatExplain 日本語で説明してください<CR>', opts)
vim.api.nvim_set_keymap('n', '<Leader>cr', '<cmd>CopilotChatReview 日本語で説明してください<CR>', opts)
vim.api.nvim_set_keymap('n', '<Leader>cf', '<cmd>CopilotChatFix 日本語で説明してください<CR>', opts)
--vim.api.nvim_set_keymap('n', '<Leader>co', '<cmd>CopilotChat refactor this code and explain in Japanese<CR>', opts)
vim.api.nvim_set_keymap('n', '<Leader>co', '<cmd>CopilotChatOptimize 日本語で説明してください<CR>', opts)
vim.api.nvim_set_keymap('n', '<Leader>ct', '<cmd>CopilotChatTests 日本語で説明してください<CR>', opts)
vim.api.nvim_set_keymap('n', '<Leader>cco', '<cmd>CopilotChatCommit 日本語で説明してください<CR>', opts)
