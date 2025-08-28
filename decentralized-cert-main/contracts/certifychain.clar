;; CertifyChain Smart Contract
;; A decentralized certificate verification system on Stacks

(define-constant CONTRACT_OWNER tx-sender)
(define-constant CERTIFICATE_COST u1000000) ;; 1 STX per certificate
(define-constant MAX_CERTIFICATE_LENGTH 1000)
(define-constant MAX_DESCRIPTION_LENGTH 500)

;; Certificate structure
(define-data-var certificate-counter uint u0)

(define-map certificates uint 
  {issuer: principal,
   recipient: principal,
   title: (string-ascii 100),
   description: (string-ascii 500),
   issue-date: uint,
   expiry-date: (optional uint),
   status: (string-ascii 20),
   block-hash: (buff 32),
   transaction-id: (buff 32)
  })

;; Issuer registry - only authorized issuers can create certificates
(define-map authorized-issuers principal bool)

;; Certificate verification requests
(define-map verification-requests uint
  {requester: principal,
   certificate-id: uint,
   request-date: uint,
   status: (string-ascii 20)
  })

;; Events
(define-event certificate-issued
  (certificate-id: uint)
  (issuer: principal)
  (recipient: principal)
  (title: (string-ascii 100))
  (issue-date: uint))

(define-event certificate-verified
  (certificate-id: uint)
  (verifier: principal)
  (verification-date: uint))

(define-event issuer-authorized
  (issuer: principal)
  (authorized-by: principal))

;; Error codes
(define-constant ERR_NOT_AUTHORIZED (err u1001))
(define-constant ERR_INVALID_CERTIFICATE (err u1002))
(define-constant ERR_CERTIFICATE_NOT_FOUND (err u1003))
(define-constant ERR_INVALID_AMOUNT (err u1004))
(define-constant ERR_CERTIFICATE_EXPIRED (err u1005))
(define-constant ERR_ALREADY_VERIFIED (err u1006))

;; Initialize contract
(define-public (initialize)
  (begin
    (map-set authorized-issuers CONTRACT_OWNER true)
    (ok true)))

;; Authorize an issuer
(define-public (authorize-issuer (issuer principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (map-set authorized-issuers issuer true)
    (emit-event issuer-authorized issuer CONTRACT_OWNER)
    (ok true)))

;; Revoke issuer authorization
(define-public (revoke-issuer (issuer principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (map-set authorized-issuers issuer false)
    (ok true)))

;; Issue a new certificate
(define-public (issue-certificate
                (recipient principal)
                (title (string-ascii 100))
                (description (string-ascii 500))
                (expiry-date (optional uint)))
  (begin
    ;; Check if sender is authorized issuer
    (asserts! (map-get? authorized-issuers tx-sender) ERR_NOT_AUTHORIZED)
    
    ;; Validate input lengths
    (asserts! (<= (len title) MAX_CERTIFICATE_LENGTH) ERR_INVALID_CERTIFICATE)
    (asserts! (<= (len description) MAX_DESCRIPTION_LENGTH) ERR_INVALID_CERTIFICATE)
    
    ;; Get current block info
    (let ((current-block (block-height)))
      ;; Increment certificate counter
      (var-set certificate-counter (+ (var-get certificate-counter) u1))
      
      ;; Create certificate
      (map-set certificates (var-get certificate-counter)
        {issuer: tx-sender,
         recipient: recipient,
         title: title,
         description: description,
         issue-date: current-block,
         expiry-date: expiry-date,
         status: "active",
         block-hash: (block-hash current-block),
         transaction-id: tx-hash})
      
      ;; Emit event
      (emit-event certificate-issued 
        (var-get certificate-counter)
        tx-sender
        recipient
        title
        current-block)
      
      (ok (var-get certificate-counter)))))

;; Verify a certificate
(define-public (verify-certificate (certificate-id uint))
  (begin
    ;; Check if certificate exists
    (asserts! (map-get? certificates certificate-id) ERR_CERTIFICATE_NOT_FOUND)
    
    (let ((certificate (unwrap! (map-get certificates certificate-id) ERR_CERTIFICATE_NOT_FOUND)))
      ;; Check if certificate is active
      (asserts! (is-eq (get status certificate) "active") ERR_CERTIFICATE_NOT_FOUND)
      
      ;; Check if certificate is expired
      (match (get expiry-date certificate) 
        expiry-date => 
          (asserts! (> (get expiry-date certificate) (block-height)) ERR_CERTIFICATE_EXPIRED)
        (none) => true)
      
      ;; Emit verification event
      (emit-event certificate-verified 
        certificate-id
        tx-sender
        (block-height))
      
      (ok certificate))))

;; Get certificate by ID
(define-read-only (get-certificate (certificate-id uint))
  (map-get certificates certificate-id))

;; Get certificate count
(define-read-only (get-certificate-count)
  (var-get certificate-counter))

;; Check if address is authorized issuer
(define-read-only (is-authorized-issuer (issuer principal))
  (map-get authorized-issuers issuer))

;; Get all certificates for a recipient
(define-read-only (get-certificates-by-recipient (recipient principal))
  (begin
    (define-private (check-recipient (cert-id uint) (cert (tuple (issuer principal) (recipient principal) (title (string-ascii 100)) (description (string-ascii 500)) (issue-date uint) (expiry-date (optional uint)) (status (string-ascii 20)) (block-hash (buff 32)) (transaction-id (buff 32)))))
      (is-eq (get recipient cert) recipient))
    
    (filter certificates check-recipient)))

;; Get all certificates by an issuer
(define-read-only (get-certificates-by-issuer (issuer principal))
  (begin
    (define-private (check-issuer (cert-id uint) (cert (tuple (issuer principal) (recipient principal) (title (string-ascii 100)) (description (string-ascii 500)) (issue-date uint) (expiry-date (optional uint)) (status (string-ascii 20)) (block-hash (buff 32)) (transaction-id (buff 32)))))
      (is-eq (get issuer cert) issuer))
    
    (filter certificates check-issuer)))

;; Revoke a certificate (only issuer or contract owner can revoke)
(define-public (revoke-certificate (certificate-id uint))
  (begin
    ;; Check if certificate exists
    (asserts! (map-get? certificates certificate-id) ERR_CERTIFICATE_NOT_FOUND)
    
    (let ((certificate (unwrap! (map-get certificates certificate-id) ERR_CERTIFICATE_NOT_FOUND)))
      ;; Check if sender is issuer or contract owner
      (asserts! (or (is-eq tx-sender (get issuer certificate)) 
                   (is-eq tx-sender CONTRACT_OWNER)) 
                ERR_NOT_AUTHORIZED)
      
      ;; Update certificate status
      (map-set certificates certificate-id
        (merge certificate {status: "revoked"}))
      
      (ok true))))

;; Update certificate (only issuer can update)
(define-public (update-certificate
                (certificate-id uint)
                (new-title (string-ascii 100))
                (new-description (string-ascii 500)))
  (begin
    ;; Check if certificate exists
    (asserts! (map-get? certificates certificate-id) ERR_CERTIFICATE_NOT_FOUND)
    
    (let ((certificate (unwrap! (map-get certificates certificate-id) ERR_CERTIFICATE_NOT_FOUND)))
      ;; Check if sender is issuer
      (asserts! (is-eq tx-sender (get issuer certificate)) ERR_NOT_AUTHORIZED)
      
      ;; Check if certificate is active
      (asserts! (is-eq (get status certificate) "active") ERR_CERTIFICATE_NOT_FOUND)
      
      ;; Validate input lengths
      (asserts! (<= (len new-title) MAX_CERTIFICATE_LENGTH) ERR_INVALID_CERTIFICATE)
      (asserts! (<= (len new-description) MAX_DESCRIPTION_LENGTH) ERR_INVALID_CERTIFICATE)
      
      ;; Update certificate
      (map-set certificates certificate-id
        (merge certificate 
          {title: new-title,
           description: new-description}))
      
      (ok true))))

;; Emergency pause (only contract owner)
(define-public (emergency-pause)
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    ;; This would require additional state management for pause functionality
    (ok true)))

;; Get contract statistics
(define-read-only (get-contract-stats)
  {total-certificates: (var-get certificate-counter),
   contract-owner: CONTRACT_OWNER,
   certificate-cost: CERTIFICATE_COST})
