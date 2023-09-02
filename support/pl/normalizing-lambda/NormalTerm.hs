data Term
  = Addr Int
  | Abs String Term
  | App Term Term
  deriving Show

-- Does `NormalTerm` include all normal forms?
data NormalTerm
  = NormalStuck StuckTerm
  | NormalAbs String StuckTerm
  deriving Show

data StuckTerm
  = StuckAddr Int
  | StuckApp StuckTerm NormalTerm
  deriving Show

-- We want `embed` to "preserve normalization". The result of normalizing an
-- embedding of a normal term should be the original normal term:
--
-- normalize (embed t) === t
--
-- In this sense, every normal term _is_ a term.
embed :: NormalTerm -> Term
embed (NormalStuck s) = embedStuck s
embed (NormalAbs p b) = Abs p (embedStuck b)

embedStuck :: StuckTerm -> Term
embedStuck (StuckAddr a) = Addr a
embedStuck (StuckApp u v) = App (embedStuck u) (embed v)

data Value

reflect :: Term -> Value
reflect = undefined

reify :: Value -> NormalTerm
reify = undefined
