;; Add starter kit and other Emacs packages
(defvar my-packages '(starter-kit starter-kit-lisp starter-kit-eshell starter-kit-bindings
	clojure-mode clojure-test-mode
        rainbow-delimiters
        ac-slime
	markdown-mode
        popup
        undo-tree ))

;; Launch the Clojure repl via Leiningen - M-x clojure-jack-in 
;; Global shortcut definition to fire up clojure repl and connect to it
(global-set-key (kbd "C-c C-j") 'clojure-jack-in)

;;; Enable undo-tree for everything, so you can M - _ to redo
;(global-undo-tree-mode)

(let ((default-directory (expand-file-name "~/.emacs.d")))
  (add-to-list 'load-path default-directory)
  (if (fboundp 'normal-top-level-add-subdirs-to-load-path)
      (normal-top-level-add-subdirs-to-load-path)))

;;----------------------------------------------------------------------
;; load settings
;;----------------------------------------------------------------------
(require 'init-loader)
(setq init-loader-show-log-after-init nil)
(init-loader-load "~/.emacs.d/inits")

(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(hl-line ((t (:underline t))))
 '(rainbow-delimiters-depth-1-face ((t (:foreground "#7f8c8d")))))
