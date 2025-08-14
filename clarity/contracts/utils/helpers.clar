;; Helper Utilities
;; Common utility functions for Stacks contracts

;; Math helpers

;; Calculate percentage of a value
(define-read-only (calculate-percentage (amount uint) (percentage uint))
  (/ (* amount percentage) u100)
)

;; Get minimum of two values
(define-read-only (min (a uint) (b uint))
  (if (< a b) a b)
)

;; Get maximum of two values
(define-read-only (max (a uint) (b uint))
  (if (> a b) a b)
)

;; String helpers

;; Check if string is empty
(define-read-only (is-string-empty (str (string-ascii 256)))
  (is-eq (len str) u0)
)

;; Validation helpers

;; Check if principal is valid (not zero address)
(define-read-only (is-valid-principal (address principal))
  (not (is-eq address 'SP000000000000000000002Q6VF78))
)

;; Check if amount is positive
(define-read-only (is-positive (amount uint))
  (> amount u0)
) 