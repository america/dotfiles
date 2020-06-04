(use-package lsp-mode
  :commands lsp
  :custom
  ((lsp-enable-snipet t)
   (lsp-enable-indentation nil)
   (lsp-prefer-flymake nil)
   (lsp-document-sync-method 'incremental)
   (lsp-inhibit-message t)
   (lsp-message-project-root-warning t)
   (create-lockfiles nil))
  :init
  (unbind-key "C-l")
  :bind
  (("C-l C-l"  . lsp)
   ("C-l h"    . lsp-describe-session)
   ("C-l t"    . lsp-goto-type-definition)
   ("C-l r"    . lsp-rename)
   ("C-l <f5>" . lsp-restart-workspace)
   ("C-l l"    . lsp-lens-mode))
  :hook
  (prog-major-mode . lsp-prog-major-mode-enable))
