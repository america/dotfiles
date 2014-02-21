;(require 'solarized-dark-theme)

;; タブ, 全角スペース, 行末空白表示
(defface my-face-b-1 '((t (:background "NavajoWhite4"))) nil) ; 全角ス
                                        ; ペース
(defface my-face-b-2 '((t (:background "gray10"))) nil) ; タブ
(defface my-face-u-1 '((t (:background "SteelBlue" :underline t))) nil) ; 行末空白
(defvar my-face-b-1 'my-face-b-1)
(defvar my-face-b-2 'my-face-b-2)
(defvar my-face-u-1 'my-face-u-1)

(defadvice font-lock-mode (before my-font-lock-mode ())
  (font-lock-add-keywords
   major-mode
   '(("\t" 0 my-face-b-2 append)
     ("　" 0 my-face-b-1 append)
     ("[ \t]+$" 0 my-face-u-1 append))))
(ad-enable-advice 'font-lock-mode 'before 'my-font-lock-mode)
(ad-activate 'font-lock-mode)

;;diredの実行ファイルに色を付ける
(defface face-for-executable '((t :foreground "#5f8700")) nil)
(defvar  face-for-executable 'face-for-executable)

(eval-after-load "dired"
  '(add-to-list
    'dired-font-lock-keywords
    (list dired-re-exe
	  '(".+" (dired-move-to-filename) nil (0 'face-for-executable)))))

(require 'rainbow-delimiters)
(global-rainbow-delimiters-mode t)
(custom-set-faces '(rainbow-delimiters-depth-1-face ((t (:foreground "#7f8c8d")))));文字列の色と被るため,変更
