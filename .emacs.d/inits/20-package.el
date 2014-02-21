(require 'package)
(add-to-list 'package-archives '("melpa" ."http://melpa.milkbox.net/packages/"))
(when (< emacs-major-version 24)
  (add-to-list 'package-archives '("gnu" . "http://elpa.gnu.org/packages/")))
(add-to-list 'package-archives '("marmalade" . "http://marmalade-repo.org/packages/"))
(package-initialize)
<<<<<<< HEAD

(require 'cl)

(defvar installing-package-list
  '(
    php-mode
    scala-mode
    markdown-mode
    scss-mode
    haskell-mode
    google-c-style
    yaml-mode
    open-junk-file))

(let ((not-installed (loop for x in installing-package-list
                           when (not (package-installed-p x))
                           collect x)))
  (when not-installed
    (package-refresh-contents)
    (dolist (pkg not-installed)
              (package-install pkg))))
=======
>>>>>>> 0b6fcfd3ed2b9ec9abf1576d0c4686cad33d97c0
