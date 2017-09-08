;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; ロードパスの追加
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
g(setq load-path (append
           '("~/.emacs.d"
             "~/.emacs.d/packages/emacs-jedi"
             "~/.emacs.d/packages/json-mode"
             "~/.emacs.d/auto-install"
             "~/.emacs.d/custom"
             "~/.emacs.d/conf"
	     "~/.emacs.d/elisp")
           load-path))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; packages.el
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(defvar my-favorite-package-list
  '(
    ;ghc-mod
    ghc
    haskell-mode
    flymake
    flymake-cursor
    color-theme-solarized
    auto-complete
    magit
    elscreen
    howm
    )
  "packages to be installed")

(require 'package)
(add-to-list 'package-archives '("melpa" . "http://melpa.milkbox.net/packages/") t)
(add-to-list 'package-archives '("marmalade" . "http://marmalade-repo.org/packages/"))
(package-initialize)
(unless package-archive-contents (package-refresh-contents))
(dolist (pkg my-favorite-package-list)
  (unless (package-installed-p pkg)
    (package-install pkg)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; フレーム関連
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; 起動時のフレーム設定
(if (boundp 'window-system)
    (setq default-frame-alist
          (append (list
                   ;'(foreground-color . "black")  ; 文字色
                   ;'(background-color . "white")  ; 背景色
                   '(border-color     . "white")  ; ボーダー色
                   ;'(mouse-color      . "black")  ; マウスカーソルの色
                   ;'(cursor-color     . "black")  ; カーソルの色
                   ;'(cursor-type      . box)      ; カーソルの形状
                   '(top . 60) ; ウィンドウの表示位置（Y座標）
                   '(left . 140) ; ウィンドウの表示位置（X座標）
                   '(width . 190) ; ウィンドウの幅（文字数）
                   '(height . 41) ; ウィンドウの高さ（文字数）
                   )
                  default-frame-alist)))
(setq initial-frame-alist default-frame-alist )

;; 起動時に分割
(setq w (selected-window))
(setq w2 (split-window w nil t))
(setq w3 (split-window w2 nil))

;; スタートアップメッセージを非表示
(setq inhibit-startup-message t)
;; ツールバー非表示
(tool-bar-mode 0)
;; メニューバー非表示
(menu-bar-mode 0)
;; スクロールバー非表示
(scroll-bar-mode 0)

;
;; Auto Complete
;;
(require 'auto-complete-config)
(ac-config-default)
(add-to-list 'ac-modes 'text-mode)         ;; text-modeでも自動的に有効にする
(add-to-list 'ac-modes 'fundamental-mode)  ;; fundamental-mode
(add-to-list 'ac-modes 'org-mode)
(add-to-list 'ac-modes 'yatex-mode)
(ac-set-trigger-key "TAB")
(setq ac-use-menu-map t)       ;; 補完メニュー表示時にC-n/C-pで補完候補選択
(setq ac-use-fuzzy t)          ;; 曖昧マッチ



;; UTF-8
;; from http://qiita.com/ironsand/items/a53797bd48170104aa74
(prefer-coding-system 'utf-8)
(setq coding-system-for-read 'utf-8)
(setq coding-system-for-write 'utf-8)


;; Disable backup
(setq backup-inhibited t)
(setq delete-auto-save-files t)

;; Paren settings
(show-paren-mode t) ;; show-paren-mode：対応する括弧を強調して表示する
(electric-pair-mode t)
(global-font-lock-mode t)

;; Ignore case
(setq completion-ignore-case t)
(setq read-file-name-completion-ignore-case t)

;; Solarized
(load-theme 'solarized-dark t)

;; Line and column number
(global-linum-mode t)
(setq linum-format: "%4d: ")
(column-number-mode t)

(require 'mozc)
(set-language-environment "Japanese")
(setq default-input-method "japanese-mozc")
(prefer-coding-system 'utf-8)
(global-set-key (kbd "C-j") 'toggle-input-method)

;(load-theme 'solarized-dark t)

(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(package-selected-packages
   (quote
    (auto-complete howm elscreen flymake flymake-cursor ghc haskell-mode color-theme-solarized))))

(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
(autoload 'ghc-init "ghc" nil t)
(add-hook 'haskell-mode-hook '(lambda ()
(ghc-init)
        (local-set-key "\C-j" (lambda () (interactive)(insert " -> ")))
        (local-set-key "\M-j" (lambda () (interactive)(insert " => ")))
        (local-set-key "\C-l" (lambda ()(interactive)(insert " <- ")))
))

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

;;; YaTeX configuration option
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
	 ; (local-set-key (kbd "C-c C-c"))
         (setq dvi2-command "evince") ; preview command
         (setq tex-pdfview-command "evince") ; preview command
    ))
   
; dvi2-commandで自動的に拡張子を補完してくれるようにする設定
(setq YaTeX-dvi2-command-ext-alist
  '(("xdvi\\|dvipdfmx" . ".dvi")
    ("ghostview\\|gv" . ".ps")
    ("evince" . ".pdf")))

;;;
;;; set configuration for magit
;;;
(global-set-key (kbd "C-x g") 'magit-status)

;;;
;;; set configuration for elscreen
;;;
(require 'elscreen)
(elscreen-start)

;;;
;;; set configuration for howm
;;;
(setq howm-menu-lang 'ja)
(require 'howm-mode)
