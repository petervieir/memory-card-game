;; dApp Promo NFT (SIP-009)
;; One NFT per dApp per player, transferable

(impl-trait .sip-009-trait.nft-trait)

;; Errors
(define-constant ERR_ALREADY_MINTED (err u100))
(define-constant ERR_NOT_OWNER (err u101))
(define-constant ERR_NOT_FOUND (err u102))

;; Data vars
(define-data-var last-token-id uint u0)

;; Maps
(define-map token-owners uint principal)
(define-map token-uris uint (string-ascii 256))
(define-map token-dapp-ids uint (string-ascii 50))
(define-map player-dapp-mints { player: principal, dapp-id: (string-ascii 50) } bool)

;; Read-only: Get last token ID
(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

;; Read-only: Get token URI
(define-read-only (get-token-uri (token-id uint))
  (ok (map-get? token-uris token-id))
)

;; Read-only: Get owner of token
(define-read-only (get-owner (token-id uint))
  (ok (map-get? token-owners token-id))
)

;; Read-only: Get dApp ID for token
(define-read-only (get-dapp-id (token-id uint))
  (ok (map-get? token-dapp-ids token-id))
)

;; Transfer token from sender to recipient
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (let ((current-owner (map-get? token-owners token-id)))
    (match current-owner owner
      (begin
        (asserts! (is-eq owner sender) ERR_NOT_OWNER)
        (asserts! (is-eq tx-sender sender) ERR_NOT_OWNER)
        (map-set token-owners token-id recipient)
        (ok true)
      )
      ERR_NOT_FOUND
    )
  )
)

;; Mint dApp NFT for the caller (one per dApp per player)
(define-public (mint-dapp-nft (dapp-id (string-ascii 50)) (metadata-uri (string-ascii 256)))
  (let (
        (key { player: tx-sender, dapp-id: dapp-id })
        (next-id (+ (var-get last-token-id) u1))
       )
    (asserts! (is-none (map-get? player-dapp-mints key)) ERR_ALREADY_MINTED)
    (begin
      (map-set player-dapp-mints key true)
      (map-set token-owners next-id tx-sender)
      (map-set token-uris next-id metadata-uri)
      (map-set token-dapp-ids next-id dapp-id)
      (var-set last-token-id next-id)
      (ok next-id)
    )
  )
)
