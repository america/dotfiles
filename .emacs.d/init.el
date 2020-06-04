;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; ロードパスの追加
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(setq load-path (append
           '("~/.emacs.d/packages/emacs-jedi"
             "~/.emacs.d/packages/json-mode"
             "~/.emacs.d/auto-install"
             "~/.emacs.d/custom"
             "~/.emacs.d/conf"
	     "~/.emacs.d/elisp"
	     "~/.emacs.d/site-lisp")
           load-path))

(add-to-list 'load-path "~/.emacs.d/site-lisp/elpa-mirror")
(require 'elpa-mirror)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; packages.el
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(require 'package)              
;; MELPAのみ追加
(add-to-list 'package-archives '("melpa" . "https://melpa.org/packages/"))
;(package-initialize)

;; パッケージ情報の更新
(package-refresh-contents)
;; インストールするパッケージ
(defvar my-favorite-package-list
  '(
    ghc
    haskell-mode
    flymake
    flymake-cursor
    color-theme-solarized
    auto-complete
    magit
    elscreen
    howm
    init-loader
    emmet-mode
    web-mode
    ac-php
    js2-mode
    flycheck
    json-mode
    rjsx-mode
    company
    rust-mode
    use-package
    spinner
    lsp-mode
    lsp-ui
    company-lsp
    yasnippet
    ccls
    )
  "packages to be installed")

(setq gnutls-algorithm-priority "NORMAL:-VERS-TLS1.3")

(unless package-archive-contents (package-refresh-contents))
(dolist (pkg my-favorite-package-list)
  (unless (package-installed-p pkg)
    (package-install pkg)))

;;
;; Auto Complete
;;
;; auto-complete-configの設定ファイルを読み込む。
(require 'auto-complete-config)

;; よくわからない
(ac-set-trigger-key "TAB");

;; auto-complete-modeを起動時に有効にする
(global-auto-complete-mode t)

;; ~/.emacs.d/site-lisp 以下全部読み込み
(let ((default-directory (expand-file-name "~/.emacs.d/site-lisp")))
  (add-to-list 'load-path default-directory)
  (if (fboundp 'normal-top-level-add-subdirs-to-load-path)
      (normal-top-level-add-subdirs-to-load-path)))

(require 'init-loader)
(setq init-loader-show-log-after-init nil)
(init-loader-load "~/.emacs.d/inits")
