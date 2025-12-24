-- Lotto Draws Table
CREATE TABLE lotto_draws (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    draw_number INT NOT NULL UNIQUE,
    numbers INT[] NOT NULL CHECK (array_length(numbers, 1) = 6),
    bonus INT NOT NULL,
    draw_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendations Table
CREATE TABLE recommendations (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    numbers INT[] NOT NULL CHECK (array_length(numbers, 1) = 6),
    type VARCHAR(50) NOT NULL, -- 'random', 'hot', 'hybrid'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Settings Table
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    favorite_numbers INT[] DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (example)
ALTER TABLE lotto_draws ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON lotto_draws FOR SELECT USING (true);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own recommendations" ON recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own recommendations" ON recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);
