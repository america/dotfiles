;;; YaTeX configuration option
(require 'yatex)
(autoload 'yatex-mode "yatex" "Yet Another LaTeX mode" t)
(setq auto-mode-alist
      (append '(("\\.tex$" . yatex-mode)
        ("\\.ltx$" . yatex-mode)
        ("\\.sty$" . yatex-mode)) auto-mode-alist))
;;; set YaTeX coding system
(setq YaTeX-kanji-code 4) ; UTF-8 の設定

(add-hook 'yatex-mode-hook
    '(lambda ()
         (setq YaTeX-use-AMS-LaTeX t) ; align で数式モードになる
         (setq YaTeX-use-hilit19 nil
           YateX-use-font-lock t)

	 (setq tex-command "uplatex") ; typeset command
         ;(setq tex-command "platex") ; typeset command
	 ; (local-set-key (kbd "C-c C-c"))
         (setq dvi2-command "evince") ; preview command
         (setq tex-pdfview-command "evince") ; preview command
    ))

; dvi2-commandで自動的に拡張子を補完してくれるようにする設定
(setq YaTeX-dvi2-command-ext-alist
  '(("xdvi\\|dvipdfmx" . ".dvi")
    ("ghostview\\|gv" . ".ps")
    ("evince" . ".pdf")))
