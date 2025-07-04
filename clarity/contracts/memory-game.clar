;; SIP-009: NFT contract for memory cards
;; Each card is a unique NFT
;; Metadata stored on Gaia
;; Flip state tracking per card

(define-trait sip009-nft-trait
  ((get-last-token-id () (response uint uint))
   (get-token-uri (uint) (response (string-utf8 256) uint))
   (get-owner (uint) (response (optional principal) uint))
   (transfer (uint principal principal) (response bool uint))))

(define-constant ERR_UNAUTHORIZED u401)
(define-constant ERR_NOT_FOUND u404)
(define-constant ERR_ALREADY_FLIPPED u410)
(define-constant ERR_GAME_NOT_ACTIVE u420)
(define-constant ERR_INSUFFICIENT_PAYMENT u421)
(define-constant ERR_INVALID_SHUFFLE_PROOF u422)
(define-constant ERR_ACHIEVEMENT_ALREADY_CLAIMED u423)

;; Contract owner for administration
(define-constant CONTRACT_OWNER tx-sender)

;; NFT tracking
(define-data-var last-token-id uint u0)
(define-data-var last-badge-id uint u0)
(define-map token-owner ((token-id uint)) (optional principal))
(define-map token-uri ((token-id uint)) (string-utf8 256))
(define-map token-flipped ((token-id uint)) bool)

;; Badge NFT tracking (for achievements)
(define-map badge-owner ((badge-id uint)) (optional principal))
(define-map badge-uri ((badge-id uint)) (string-utf8 256))
(define-map badge-type ((badge-id uint)) (string-ascii 50))

;; Game state per player
(define-map player-game-uri ((player principal)) (string-utf8 256))
(define-map player-flipped ((player principal)) (list 2 uint))
(define-map player-game-active ((player principal)) bool)
(define-map player-game-start-time ((player principal)) uint)
(define-map player-mismatches ((player principal)) uint)

;; Enhanced leaderboard maps
(define-map best-times ((player principal)) uint)   ;; lower is better  
(define-map best-moves ((player principal)) uint)   ;; lower is better
(define-map player-stats 
  ((player principal))
  {
    best-moves: uint,
    best-time: uint,
    total-games: uint,
    total-wins: uint,
    win-streak: uint,
    current-streak: uint
  })

;; Global leaderboard tracking (top 10)
(define-map global-leaderboard-times ((rank uint)) (optional {player: principal, time: uint}))
(define-map global-leaderboard-moves ((rank uint)) (optional {player: principal, moves: uint}))

;; Verifiable shuffle system
(define-map game-shuffle-commit ((player principal)) (buff 32))
(define-map game-shuffle-reveal ((player principal)) (optional (string-utf8 256)))

;; Achievement tracking
(define-map player-achievements ((player principal) (achievement (string-ascii 50))) bool)
(define-map achievement-badges ((achievement (string-ascii 50))) uint) ;; badge-id for each achievement

;; Entry fee system
(define-data-var entry-fee uint u0) ;; in micro-STX
(define-data-var prize-pool uint u0)
(define-map player-paid-entry ((player principal)) bool)

;; #define-public
(define-public (mint (uri (string-utf8 256)))
  (let ((new-id (+ u1 (var-get last-token-id))))
    (begin
      (var-set last-token-id new-id)
      (map-set token-owner ((token-id new-id)) (some tx-sender))
      (map-set token-uri ((token-id new-id)) uri)
      (map-set token-flipped ((token-id new-id)) false)
      (ok new-id))))

;; #define-public
(define-public (flip-card (token-id uint))
  (let ((owner (map-get? token-owner ((token-id token-id)))))
    (if (is-none owner)
        (err ERR_NOT_FOUND)
        (let ((is-owner (is-eq (unwrap! owner (err ERR_NOT_FOUND)) tx-sender)))
          (if (not is-owner)
              (err ERR_UNAUTHORIZED)
              (let ((flipped (default-to false (map-get? token-flipped ((token-id token-id))))))
                (if flipped
                    (err ERR_ALREADY_FLIPPED)
                    (begin
                      (map-set token-flipped ((token-id token-id)) true)
                      (ok true)))))))))

(define-read-only (get-last-token-id)
  (ok (var-get last-token-id)))

(define-read-only (get-token-uri (token-id uint))
  (match (map-get? token-uri ((token-id token-id)))
    uri (ok uri)
    (err ERR_NOT_FOUND)))

(define-read-only (get-owner (token-id uint))
  (ok (map-get? token-owner ((token-id token-id)))))

(define-read-only (get-player-game-uri (player principal))
  (ok (map-get? player-game-uri ((player player)))))

(define-read-only (get-player-flipped (player principal))
  (ok (map-get? player-flipped ((player player)))))

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (let ((owner (map-get? token-owner ((token-id token-id)))))
    (if (is-none owner)
        (err ERR_NOT_FOUND)
        (let ((is-owner (is-eq (unwrap! owner (err ERR_NOT_FOUND)) sender)))
          (if (not is-owner)
              (err ERR_UNAUTHORIZED)
              (begin
                (map-set token-owner ((token-id token-id)) (some recipient))
                (ok true)))))))

;; #define-public
(define-public (start-game-with-entry (game-uri (string-utf8 256)) (shuffle-commit (buff 32)))
  ;; Enhanced start game with optional entry fee and shuffle commitment
  (let ((fee (var-get entry-fee)))
    (begin
      ;; Check entry fee if required
      (if (> fee u0)
          (begin
            (try! (stx-transfer? fee tx-sender (as-contract tx-sender)))
            (map-set player-paid-entry ((player tx-sender)) true)
            (var-set prize-pool (+ (var-get prize-pool) fee)))
          true)
      
      ;; Store shuffle commitment for verifiable randomness
      (map-set game-shuffle-commit ((player tx-sender)) shuffle-commit)
      
      ;; Initialize game state
      (map-set player-game-uri ((player tx-sender)) game-uri)
      (map-set player-flipped ((player tx-sender)) (list))
      (map-set player-game-active ((player tx-sender)) true)
      (map-set player-game-start-time ((player tx-sender)) block-height)
      (map-set player-mismatches ((player tx-sender)) u0)
      (ok true))))

;; #define-public
(define-public (check-match-enhanced)
  ;; Enhanced match checking with mismatch tracking
  (let ((flipped (default-to (list) (map-get? player-flipped ((player tx-sender))))))
    (if (not (= (len flipped) u2))
        (err u421) ;; Need two cards
        (let ((card1 (element-at flipped u0))
              (card2 (element-at flipped u1))
              (is-match false)) ;; This would be determined by off-chain logic
          (begin
            ;; If not a match, increment mismatch counter
            (if (not is-match)
                (map-set player-mismatches ((player tx-sender)) 
                  (+ (default-to u0 (map-get? player-mismatches ((player tx-sender)))) u1))
                true)
            ;; Reset flipped cards
            (map-set player-flipped ((player tx-sender)) (list))
            (ok {card1: card1, card2: card2, is-match: is-match}))))))

;; #define-public  
(define-public (complete-game-enhanced (moves uint) (time-taken uint) (shuffle-reveal (string-utf8 256)))
  ;; Enhanced game completion with leaderboard updates and achievement checking
  (let ((start-time (default-to u0 (map-get? player-game-start-time ((player tx-sender)))))
        (mismatches (default-to u0 (map-get? player-mismatches ((player tx-sender)))))
        (current-stats (default-to 
                         {best-moves: u999, best-time: u999, total-games: u0, total-wins: u0, win-streak: u0, current-streak: u0}
                         (map-get? player-stats ((player tx-sender))))))
    
    ;; Verify shuffle reveal matches commit (simplified)
    (map-set game-shuffle-reveal ((player tx-sender)) (some shuffle-reveal))
    
    (let ((new-best-moves (if (< moves (get best-moves current-stats)) moves (get best-moves current-stats)))
          (new-best-time (if (< time-taken (get best-time current-stats)) time-taken (get best-time current-stats)))
          (new-total-games (+ (get total-games current-stats) u1))
          (new-total-wins (+ (get total-wins current-stats) u1))
          (new-streak (+ (get current-streak current-stats) u1)))
      
      (begin
        ;; Update player stats
        (map-set player-stats ((player tx-sender)) 
          {
            best-moves: new-best-moves,
            best-time: new-best-time,
            total-games: new-total-games,
            total-wins: new-total-wins,
            win-streak: (if (> new-streak (get win-streak current-stats)) new-streak (get win-streak current-stats)),
            current-streak: new-streak
          })
        
        ;; Update global leaderboards
        (map-set best-times ((player tx-sender)) new-best-time)
        (map-set best-moves ((player tx-sender)) new-best-moves)
        
        ;; Check and award achievements
        (try! (check-and-award-achievements tx-sender new-best-time mismatches new-streak))
        
        ;; Clean up game state
        (map-set player-game-active ((player tx-sender)) false)
        (map-delete player-game-uri ((player tx-sender)))
        (map-delete player-flipped ((player tx-sender)))
        (map-delete player-mismatches ((player tx-sender)))
        
        (ok {
          new-best-moves: new-best-moves,
          new-best-time: new-best-time,
          achievements-earned: true
        })))))

;; #define-public
(define-public (check-and-award-achievements (player principal) (time uint) (mismatches uint) (streak uint))
  ;; Check various achievement conditions and mint badge NFTs
  (begin
    ;; Sub-60s achievement
    (if (and (< time u60) (not (default-to false (map-get? player-achievements ((player player) (achievement "sub-60s"))))))
        (begin
          (try! (mint-achievement-badge player "sub-60s" "ipfs://achievement-sub60s.json"))
          (map-set player-achievements ((player player) (achievement "sub-60s")) true))
        true)
    
    ;; Flawless achievement (no mismatches)
    (if (and (= mismatches u0) (not (default-to false (map-get? player-achievements ((player player) (achievement "flawless"))))))
        (begin
          (try! (mint-achievement-badge player "flawless" "ipfs://achievement-flawless.json"))
          (map-set player-achievements ((player player) (achievement "flawless")) true))
        true)
    
    ;; 10-game streak achievement
    (if (and (>= streak u10) (not (default-to false (map-get? player-achievements ((player player) (achievement "streak-10"))))))
        (begin
          (try! (mint-achievement-badge player "streak-10" "ipfs://achievement-streak10.json"))
          (map-set player-achievements ((player player) (achievement "streak-10")) true))
        true)
    
    (ok true)))

;; #define-public
(define-public (mint-achievement-badge (player principal) (achievement (string-ascii 50)) (uri (string-utf8 256)))
  ;; Mint a special badge NFT for achievements
  (let ((new-badge-id (+ u1 (var-get last-badge-id))))
    (begin
      (var-set last-badge-id new-badge-id)
      (map-set badge-owner ((badge-id new-badge-id)) (some player))
      (map-set badge-uri ((badge-id new-badge-id)) uri)
      (map-set badge-type ((badge-id new-badge-id)) achievement)
      (map-set achievement-badges ((achievement achievement)) new-badge-id)
      (ok new-badge-id))))

;; #define-public
(define-public (mint-genesis-card (uri (string-utf8 256)) (card-name (string-ascii 50)))
  ;; Allow players to mint unique Genesis cards for their collection
  (let ((new-id (+ u1 (var-get last-token-id))))
    (begin
      (var-set last-token-id new-id)
      (map-set token-owner ((token-id new-id)) (some tx-sender))
      (map-set token-uri ((token-id new-id)) uri)
      (map-set token-flipped ((token-id new-id)) false)
      (ok new-id))))

;; Read-only: Get player's best time
(define-read-only (get-player-best-time (player principal))
  (ok (map-get? best-times ((player player)))))

;; Read-only: Get player's best moves
(define-read-only (get-player-best-moves (player principal))
  (ok (map-get? best-moves ((player player)))))

;; Read-only: Get leaderboard entry for a specific player
(define-read-only (get-leaderboard-entry-enhanced (player principal))
  (let ((best-time (map-get? best-times ((player player))))
        (best-moves (map-get? best-moves ((player player))))
        (stats (map-get? player-stats ((player player)))))
    (match stats
      player-data (ok (some {
        player: player,
        best-time: (default-to u999 best-time),
        best-moves: (default-to u999 best-moves),
        total-games: (get total-games player-data),
        total-wins: (get total-wins player-data),
        win-streak: (get win-streak player-data)
      }))
      (ok none))))

;; Read-only: Check if player has paid entry fee
(define-read-only (get-entry-fee-status (player principal))
  (ok {
    fee-required: (var-get entry-fee),
    has-paid: (default-to false (map-get? player-paid-entry ((player player)))),
    prize-pool: (var-get prize-pool)
  }))

;; Read-only: Get player achievements
(define-read-only (get-player-achievements (player principal))
  (ok {
    sub-60s: (default-to false (map-get? player-achievements ((player player) (achievement "sub-60s")))),
    flawless: (default-to false (map-get? player-achievements ((player player) (achievement "flawless")))),
    streak-10: (default-to false (map-get? player-achievements ((player player) (achievement "streak-10"))))
  }))

;; Read-only: Verify shuffle proof
(define-read-only (verify-shuffle-proof (player principal) (reveal (string-utf8 256)))
  ;; Verify that the reveal matches the original commitment
  ;; This is a simplified version - real implementation would use proper hash verification
  (ok (is-some (map-get? game-shuffle-reveal ((player player))))))

;; Admin functions
;; #define-public
(define-public (set-entry-fee (fee uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err ERR_UNAUTHORIZED))
    (var-set entry-fee fee)
    (ok true)))

;; #define-public
(define-public (distribute-prize-pool (winner principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err ERR_UNAUTHORIZED))
    (let ((pool (var-get prize-pool)))
      (if (> pool u0)
          (begin
            (try! (as-contract (stx-transfer? pool tx-sender winner)))
            (var-set prize-pool u0)
            (ok pool))
          (ok u0)))))
