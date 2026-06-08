CREATE TABLE public.redesign_usage (
  ip TEXT NOT NULL,
  day DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (ip, day)
);
GRANT ALL ON public.redesign_usage TO service_role;
ALTER TABLE public.redesign_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only" ON public.redesign_usage FOR ALL TO service_role USING (true) WITH CHECK (true);