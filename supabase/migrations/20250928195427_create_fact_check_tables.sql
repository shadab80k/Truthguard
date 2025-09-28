-- Create fact_checks table
CREATE TABLE IF NOT EXISTS public.fact_checks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    statement TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('true', 'questionable', 'fake')),
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    reasoning TEXT NOT NULL,
    user_id UUID,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sources table
CREATE TABLE IF NOT EXISTS public.sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fact_check_id UUID NOT NULL REFERENCES public.fact_checks(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT,
    credibility TEXT NOT NULL CHECK (credibility IN ('high', 'medium', 'low')),
    summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fact_checks_created_at ON public.fact_checks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fact_checks_user_id ON public.fact_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_fact_checks_status ON public.fact_checks(status);
CREATE INDEX IF NOT EXISTS idx_sources_fact_check_id ON public.sources(fact_check_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.fact_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for fact_checks
CREATE POLICY "Public fact checks are viewable by everyone" 
ON public.fact_checks FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can view their own fact checks" 
ON public.fact_checks FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fact checks" 
ON public.fact_checks FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own fact checks" 
ON public.fact_checks FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for sources
CREATE POLICY "Sources are viewable if fact check is viewable" 
ON public.sources FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.fact_checks 
    WHERE id = sources.fact_check_id 
    AND (is_public = true OR auth.uid() = user_id)
  )
);

CREATE POLICY "Sources can be inserted with fact checks" 
ON public.sources FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.fact_checks 
    WHERE id = sources.fact_check_id 
    AND (auth.uid() = user_id OR user_id IS NULL)
  )
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.fact_checks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();