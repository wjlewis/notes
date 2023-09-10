isEven n
  | n == 0    = True
  | otherwise = isOdd (n - 1)

isOdd n
  | n == 0    = False
  | otherwise = isEven (n - 1)

isPrime n
  | n < 2 = False
  | otherwise = loop 2
    where
      loop d
        | d >= n         = True
        | n `rem` d == 0 = False
        | otherwise      = loop (d + 1)
      
