(define-map best-scores principal uint)

(define-read-only (get-best-score (player principal))
  (map-get? best-scores player)
)

(define-read-only (get-my-best)
  (map-get? best-scores tx-sender)
)

(define-public (submit-score (score uint))
  (let ((current (default-to u0 (map-get? best-scores tx-sender))))
    (if (> score current)
        (begin
          (map-set best-scores tx-sender score)
          (ok score)
        )
        (ok current)
    )
  )
)
