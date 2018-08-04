(require 'web-mode)
;; *.phtml, *.html, *.htm, *.tpl.php, *.jsp, *.ascx, *.aspx, *.erb
(add-to-list 'auto-mode-alist '("\\.p?html?\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.php\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.jsp\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.as[cp]x\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.erb\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.css\\'" . web-mode))
;; なぜか C-;に C-c C-;と同じ機能が割り当てられてるので削除する
(define-key web-mode-map (kbd "C-;") nil)
;;;
(add-hook 'web-mode-hook 'rainbow-delimiters-mode-enable)

(setq web-mode-markup-indent-offset 2) ;; html indent
(setq web-mode-css-indent-offset 2)    ;; css indent
(setq web-mode-code-indent-offset 2)   ;; script indent(js,php,etc..)
