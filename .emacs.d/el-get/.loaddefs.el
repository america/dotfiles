;;; .loaddefs.el --- automatically extracted autoloads
;;
;;; Code:


;;;### (autoloads nil "rjsx-mode/rjsx-mode" "rjsx-mode/rjsx-mode.el"
;;;;;;  (23415 48333 866691 67000))
;;; Generated autoloads from rjsx-mode/rjsx-mode.el

(autoload 'rjsx-mode "rjsx-mode/rjsx-mode" "\
Major mode for editing JSX files.

\(fn)" t nil)

(autoload 'rjsx-minor-mode "rjsx-mode/rjsx-mode" "\
Minor mode for parsing JSX syntax into an AST.

\(fn &optional ARG)" t nil)

(add-to-list 'auto-mode-alist '("\\.jsx\\'" . rjsx-mode))

(autoload 'rjsx-comment-dwim "rjsx-mode/rjsx-mode" "\
RJSX implementation of `comment-dwim'. If called on a region,
this function delegates to `comment-or-uncomment-region'. If the
point is not in a JSX context, it delegates to the
`comment-dwim', otherwise it will comment the JSX AST node at
point using the apppriate comment delimiters.

For example: If point is on a JSX attribute or JSX expression, it
will comment the entire attribute using \"/* */\". , otherwise if
it's on a descendent JSX Element, it will use \"{/* */}\"
instead.

\(fn ARG)" t nil)

;;;***

;;;### (autoloads nil nil ("rjsx-mode/rjsx-mode-autoloads.el" "rjsx-mode/rjsx-mode-pkg.el")
;;;;;;  (23415 48333 931691 64000))

;;;***

(provide '.loaddefs)
;; Local Variables:
;; version-control: never
;; no-update-autoloads: t
;; coding: utf-8
;; End:
;;; .loaddefs.el ends here
