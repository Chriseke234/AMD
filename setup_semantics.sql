-- Table: public.semantic_definitions
-- This table stores user-defined terminology and business logic to map into the AI context.

CREATE TABLE IF NOT EXISTS public.semantic_definitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    dataset_id UUID REFERENCES public.datasets(id) ON DELETE CASCADE, -- Optional: if tied to a specific dataset
    term TEXT NOT NULL,
    definition TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.semantic_definitions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only select their own definitions
CREATE POLICY "Users can view own semantic definitions"
ON public.semantic_definitions
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own definitions
CREATE POLICY "Users can insert own semantic definitions"
ON public.semantic_definitions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own definitions
CREATE POLICY "Users can update own semantic definitions"
ON public.semantic_definitions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own definitions
CREATE POLICY "Users can delete own semantic definitions"
ON public.semantic_definitions
FOR DELETE
USING (auth.uid() = user_id);
