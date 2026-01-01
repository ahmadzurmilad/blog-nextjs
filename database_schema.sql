-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.article_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  parent_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT article_categories_pkey PRIMARY KEY (id),
  CONSTRAINT article_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.article_categories(id)
);
CREATE TABLE public.article_tag_pivot (
  article_id uuid NOT NULL,
  tag_id uuid NOT NULL,
  CONSTRAINT article_tag_pivot_pkey PRIMARY KEY (article_id, tag_id),
  CONSTRAINT article_tag_pivot_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id),
  CONSTRAINT article_tag_pivot_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.article_tags(id)
);
CREATE TABLE public.article_tags (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  CONSTRAINT article_tags_pkey PRIMARY KEY (id)
);
CREATE TABLE public.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  author_id uuid,
  category_id uuid,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'draft'::text,
  published_at timestamp with time zone,
  seo_title text,
  seo_description text,
  seo_keywords text,
  view_count integer DEFAULT 0,
  thumbnail text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT articles_pkey PRIMARY KEY (id),
  CONSTRAINT articles_author_id_fkey2 FOREIGN KEY (author_id) REFERENCES auth.users(id),
  CONSTRAINT articles_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.article_categories(id)
);
CREATE TABLE public.media (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_path text NOT NULL,
  mime_type text,
  size integer,
  alt_text text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT media_pkey PRIMARY KEY (id)
);
CREATE TABLE public.pages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'draft'::text,
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text,
  phone text,
  first_name text,
  last_name text,
  role USER-DEFINED DEFAULT 'guest'::user_role,
  avatar_url text,
  bio text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

