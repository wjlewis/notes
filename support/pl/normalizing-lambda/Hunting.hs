module Hunting where

data Term = Addr Int
          | Abs String Term
          | App Term Term
  deriving Show

reduce :: Term -> Term
reduce t = case step t of
  (False, t') -> t'
  (True, t')  -> reduce t'

step :: Term -> (Bool, Term)
step t@(Addr _) = (False, t)
step (Abs p b)  = Abs p <$> step b
step (App (Abs _ b) t) = let arg = shift t 1
                             b'  = subst b arg
                          in (True, shift b' (-1))
step (App s t) = (flip App t <$> step s) <||> (App s <$> step t)

shift :: Term -> Int -> Term
shift = loop 0
  where
    loop :: Int -> Term -> Int -> Term
    loop bc t@(Addr a) n
      | a >= bc   = Addr (a + n)
      | otherwise = t
    loop bc (Abs p b) n = Abs p (loop (bc + 1) b n)
    loop bc (App s t) n = App (loop bc s n) (loop bc t n)

subst :: Term -> Term -> Term
subst = loop 0
  where
    loop :: Int -> Term -> Term -> Term
    loop sa t@(Addr a) sub
      | a == sa   = shift sub sa
      | otherwise = t
    loop sa (Abs p b) sub = Abs p (loop (sa + 1) b sub)
    loop sa (App s t) sub = App (loop sa s sub) (loop sa t sub)

(<||>) :: (Bool, a) -> (Bool, a) -> (Bool, a)
t@(True, _) <||> _ = t
_           <||> x = x

infixr 2 <||>

-- (\n -> \s -> \z -> s ((n s) z)) \s -> \z -> s z
one :: Term
one = Abs "s" $ Abs "z" $ App (Addr 1) (Addr 0)

suc :: Term
suc = Abs "n" $ Abs "s" $ Abs "z" $ App (Addr 1) (App (App (Addr 2) (Addr 1)) (Addr 0))

t :: Term
t = App suc one

