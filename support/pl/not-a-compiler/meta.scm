; number?
; boolean?
; symbol?

(define (lookup name env)

(define (eval expr env)
  (cond [(number? expr) expr]
        [(boolean? expr) expr]
        [(symbol? expr) (lookup expr env)]
        [#t
         (let ([f (first expr)]
               [r (rest expr)])
           (cond [(eq? f 'if)
                  (let ([v (eval (first r) env)])
                    (eval (if v (second r) (third r)) env))]
                 [(eq? f 'lambda)
                  (
          