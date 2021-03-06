;; スタートアップメッセージを非表示
(setq inhibit-startup-message t)
;; Emacsからの質問をy/nで回答する
(fset 'yes-or-no-p 'y-or-n-p)

;; ミニバッファの履歴を保存する
(savehist-mode t)
(setq history-length 10000)		;履歴数

;; ツールバー非表示
(tool-bar-mode 0)
;; メニューバー非表示
(menu-bar-mode 0)
;;; スクロールバーを右側に表示する
(set-scroll-bar-mode 'right)

;; スクロールを一行ずつにする
(setq scroll-step 1)

;; 画面右端で折り返さない
(setq-default truncate-lines t)
(setq truncate-partial-width-windows t)

;; UTF-8
;; from http://qiita.com/ironsand/items/a53797bd48170104aa74
(prefer-coding-system 'utf-8)
(setq coding-system-for-read 'utf-8)
(setq coding-system-for-write 'utf-8)

;; バックアップとオートセーブファイルを~/.emacs.d/backups/へ集める
(add-to-list 'backup-directory-alist
	     (cons "." "~/.emacs.d/backups/"))
(setq auto-save-file-name-transforms
      `((".*" ,(expand-file-name "~/.emacs.d/backups/") t)))
;; オートセーブファイル作成までの秒間隔
(setq auto-save-timeout 15)
;; オートセーブファイル作成までのタイプ間隔
(setq auto-save-interval 60)

;; show-paren-mode：対応する括弧を強調して表示する
(show-paren-mode t)
;(electric-pair-mode t)
;(global-font-lock-mode t)
(setq show-paren-delay 0) ;表示までの秒数。初期値は0.125
(setq show-paren-style 'expression)    ;括弧内も強調

;; Ignore case
(setq completion-ignore-case t)
(setq read-file-name-completion-ignore-case t)

;; Solarized
(load-theme 'solarized-dark t)

;; Line and column number
(global-linum-mode t)
(setq linum-format: "%4d: ")
(column-number-mode t)

(use-package mozc
  :init
  (setq default-input-method "japanese-mozc")
  :custom
  (mozc-candidate-style 'overlay))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; フレーム関連
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; 起動時のフレーム設定
(if (boundp 'window-system)
    (cond
      ((string= system-type "darwin")
        (setq default-frame-alist
          (append (list
                ;'(foreground-color . "black")  ; 文字色
                ;'(background-color . "white")  ; 背景色
                '(border-color     . "white")  ; ボーダー色
                ;'(mouse-color      . "black")  ; マウスカーソルの色
                ;'(cursor-color     . "black")  ; カーソルの色
                ;'(cursor-type      . box)      ; カーソルの形状
                '(top . 60) ; ウィンドウの表示位置（Y座標）
                '(left . 0) ; ウィンドウの表示位置（X座標）
                ;'(width . 180) ; ウィンドウの幅（文字数）
                '(height . 41) ; ウィンドウの高さ（文字数）
                )
                default-frame-alist
          )
        )
      )
      ((string= system-type "gnu/linux")
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
                ;'(width . 190) ; ウィンドウの幅（文字数）
                '(height . 41) ; ウィンドウの高さ（文字数）
                )
                default-frame-alist
          )
        )
      )
    )
)
(setq initial-frame-alist default-frame-alist )

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

;;;
;;; set configuration for GC
;;;
;; GCを減らして軽くする
(setq gc-cons-threshold (* gc-cons-threshold 10))

;; GCが走ったときにメッセージを表示する
(setq garbage-collection-messages t)
