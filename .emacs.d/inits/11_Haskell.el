(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(package-selected-packages
   (quote
    (init-loader auto-complete howm elscreen flymake flymake-cursor ghc haskell-mode color-theme-solarized))))

(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
(autoload 'ghc-init "ghc" nil t)
(add-hook 'haskell-mode-hook '(lambda ()
;(ghc-init)
;        (local-set-key "\C-j" (lambda () (interactive)(insert " -> ")))
;        (local-set-key "\M-j" (lambda () (interactive)(insert " => ")))
;        (local-set-key "\C-l" (lambda ()(interactive)(insert " <- ")))
					;))

(defadvice inferior-haskell-load-file (after change-focus-after-load)
  "Change focus to GHCi window after C-c C-l command"
  (other-window 1))
(ad-activate 'inferior-haskell-load-file)

;; haskell ghc-mod
;; https://github.com/kazu-yamamoto/ghc-mod
(autoload 'ghc-init "ghc" nil t)
(add-hook 'haskell-mode-hook (lambda () (ghc-init) (flymake-mode)))

;;; haskell-mode
(require 'haskell-mode)
(add-hook 'haskell-mode-hook 'turn-on-haskell-indentation)
