;; SIP-009 NFT Trait
;; Standard trait definition for Non-Fungible Tokens on Stacks

(define-trait nft-trait
  (
    ;; Get the last token ID
    (get-last-token-id () (response uint uint))

    ;; Get token URI for metadata
    (get-token-uri (uint) (response (optional (string-ascii 256)) uint))

    ;; Get owner of a specific token
    (get-owner (uint) (response (optional principal) uint))

    ;; Transfer token from one principal to another
    (transfer (uint principal principal) (response bool uint))
  )
) 