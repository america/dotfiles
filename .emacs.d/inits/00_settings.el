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
;; Macの時は読み込まない
(when (not (eq system-type 'darwin))
  (scroll-bar-mode 0)
  )

;;
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

;; Macの時は読み込まない
(when (not (eq system-type 'darwin))
  (require 'mozc)
  (set-language-environment "Japanese")
  (setq default-input-method "japanese-mozc")
  (prefer-coding-system 'utf-8)
  (global-set-key (kbd "C-j") 'toggle-input-method)
)

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
