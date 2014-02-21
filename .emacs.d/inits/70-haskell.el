(require 'haskell-mode)
(require 'haskell-cabal)
(require 'flymake)
(defun flymake-haskell-init ()
  (let* ((temp-file   (flymake-init-create-temp-buffer-copy
                       'flymake-create-temp-inplace))
         (local-dir   (file-name-directory buffer-file-name))
         (local-file  (file-relative-name
                       temp-file
                       local-dir)))
    (list "~/tool/sh/flycheck_haskell.pl" (list local-file local-dir))))
 
(push '(".+\\hs$" flymake-haskell-init) flymake-allowed-file-name-masks)
(push '(".+\\lhs$" flymake-haskell-init) flymake-allowed-file-name-masks)
(push
 '("^\\(\.+\.hs\\|\.lhs\\):\\([0-9]+\\):\\([0-9]+\\):\\(.+\\)"
   1 2 3 4) flymake-err-line-patterns)

(add-hook 'haskell-mode-hook
          '(lambda ()
             (if (not (null buffer-file-name)) (flymake-mode))
          ))
(add-to-list 'auto-mode-alist '("\\.hs$" . haskell-mode))
 
(global-set-key "\C-cd"
                'flymake-show-and-sit )
  
 (setq haskell-doc-idle-delay 0.1)
  
 (defun flymake-show-and-sit ()
  "Displays the error/warning for the current line in the minibuffer"
  (interactive)
  (progn
    (let* ( (line-no             (flymake-current-line-no) )
         (line-err-info-list  (nth 0 (flymake-find-err-info flymake-err-info line-no)))
         (count               (length line-err-info-list))
         )
    (while (> count 0)
      (when line-err-info-list
        (let* ((file       (flymake-ler-file (nth (1- count) line-err-info-list)))
               (full-file  (flymake-ler-full-file (nth (1- count) line-err-info-list)))
               (text (flymake-ler-text (nth (1- count) line-err-info-list)))
               (line       (flymake-ler-line (nth (1- count) line-err-info-list))))
          (message "[%s] %s" line text)
          )
        )
      (setq count (1- count)))))
  (sit-for 60.0)
  )
  
 ;; Auto enter flymake
 (add-hook 'haskell-mode-hook
          '(lambda ()
             (flymake-mode)))
