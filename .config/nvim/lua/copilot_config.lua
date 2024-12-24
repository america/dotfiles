require("CopilotChat").setup({
  show_help = "yes",
  prompts = {
    Explain = {
      prompt = "/COPILOT_EXPLAIN コードを日本語で説明してください",
      mapping = '<leader>ce',
      description = "コードの説明をお願いする",
    },
    Review = {
      prompt = '/COPILOT_REVIEW コードを日本語でレビューしてください。',
      mapping = '<leader>cr',
      description = "コードのレビューをお願いする",
    },
    Fix = {
      prompt = "/COPILOT_FIX このコードには問題があります。バグを修正したコードを表示してください。説明は日本語でお願いします。",
      mapping = '<leader>cf',
      description = "コードの修正をお願いする",
    },
    Optimize = {
      prompt = "/COPILOT_REFACTOR 選択したコードを最適化し、パフォーマンスと可読性を向上させてください。説明は日本語でお願いします。",
      mapping = '<leader>co',
      description = "コードの最適化をお願いする",
    },
    Commit = {
      prompt =
      '実装差分に対するコミットメッセージを日本語で記述してください。',
      mapping = '<leader>cco',
      description = "コミットメッセージの作成をお願いする",
      selection = require('CopilotChat.select').gitdiff,
    },
    CommitStaged = {
      prompt =
      'ステージ済みの変更に対するコミットメッセージを日本語で記述してください。',
      mapping = '<leader>cs',
      description = "ステージ済みのコミットメッセージの作成をお願いする",
      selection = function(source)
      return require('CopilotChat.select').gitdiff(source, true)
      end,
    },
  },
})

