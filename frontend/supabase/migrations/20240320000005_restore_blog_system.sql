-- Drop existing tables if they exist
DROP TABLE IF EXISTS blog_reports CASCADE;
DROP TABLE IF EXISTS blog_likes CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;

-- Create users table in public schema if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    usn TEXT,
    role TEXT DEFAULT 'user',
    reputation INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create blogs table
CREATE TABLE blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    banner_url TEXT,
    category TEXT NOT NULL,
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create blog_likes table
CREATE TABLE blog_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(blog_id, user_id)
);

-- Create blog_reports table
CREATE TABLE blog_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(blog_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for users
CREATE POLICY "Anyone can view users"
ON public.users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Create policies for blogs
CREATE POLICY "Anyone can view blogs"
ON blogs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create blogs"
ON blogs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own blogs"
ON blogs FOR UPDATE
TO authenticated
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own blogs"
ON blogs FOR DELETE
TO authenticated
USING (auth.uid() = author_id);

-- Create policies for blog_likes
CREATE POLICY "Anyone can view likes"
ON blog_likes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can like blogs"
ON blog_likes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike blogs"
ON blog_likes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create policies for blog_reports
CREATE POLICY "Anyone can view reports"
ON blog_reports FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can report blogs"
ON blog_reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their reports"
ON blog_reports FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_users_id ON public.users(id);
CREATE INDEX idx_blogs_author_id ON blogs(author_id);
CREATE INDEX idx_blogs_created_at ON blogs(created_at);
CREATE INDEX idx_blog_likes_blog_id ON blog_likes(blog_id);
CREATE INDEX idx_blog_likes_user_id ON blog_likes(user_id);
CREATE INDEX idx_blog_reports_blog_id ON blog_reports(blog_id);
CREATE INDEX idx_blog_reports_user_id ON blog_reports(user_id);

-- Grant necessary permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON blogs TO authenticated;
GRANT ALL ON blog_likes TO authenticated;
GRANT ALL ON blog_reports TO authenticated;

-- Create function to handle blog deletion when reports threshold is reached
CREATE OR REPLACE FUNCTION handle_blog_reports()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if blog has reached report threshold (5 reports)
    IF (SELECT COUNT(*) FROM blog_reports WHERE blog_id = NEW.blog_id) >= 5 THEN
        -- Delete the blog
        DELETE FROM blogs WHERE id = NEW.blog_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for blog reports
CREATE TRIGGER on_blog_report
AFTER INSERT ON blog_reports
FOR EACH ROW
EXECUTE FUNCTION handle_blog_reports();

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, name, usn)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'usn');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user(); 