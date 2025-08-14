;; Main Contract
;; A simple example contract for the Template Stacks dApp

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_NOT_FOUND (err u101))

;; Data Variables
(define-data-var contract-name (string-ascii 50) "Template Contract")
(define-data-var counter uint u0)

;; Data Maps
(define-map user-data principal { name: (string-ascii 50), joined-at: uint })

;; Public Functions

;; Get the current counter value
(define-read-only (get-counter)
  (var-get counter)
)

;; Get contract name
(define-read-only (get-contract-name)
  (var-get contract-name)
)

;; Increment counter (anyone can call)
(define-public (increment-counter)
  (begin
    (var-set counter (+ (var-get counter) u1))
    (ok (var-get counter))
  )
)

;; Set user data
(define-public (set-user-data (name (string-ascii 50)))
  (begin
    (map-set user-data tx-sender { name: name, joined-at: block-height })
    (ok true)
  )
)

;; Get user data
(define-read-only (get-user-data (user principal))
  (map-get? user-data user)
)

;; Admin function to reset counter (only owner)
(define-public (reset-counter)
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    (var-set counter u0)
    (ok true)
  )
) 