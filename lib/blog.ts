// Simple Blog Management System using Markdown files
// This allows non-technical users to create blog posts using any text editor

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  content: string;
  featured?: boolean;
  tags?: string[];
  image?: string;
  readTime?: string;
}

// Get all blog post files
export function getAllPosts(): BlogPost[] {
  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPosts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        // Calculate read time (average 200 words per minute)
        const wordCount = content.split(' ').length;
        const readTime = Math.ceil(wordCount / 200) + ' min read';

        return {
          id,
          content,
          readTime,
          title: data.title || 'Untitled',
          date: data.date || new Date().toISOString(),
          author: data.author || 'CVG Family Law',
          category: data.category || 'General',
          excerpt: data.excerpt || content.substring(0, 200) + '...',
          featured: data.featured || false,
          tags: data.tags || [],
          image: data.image || null,
        } as BlogPost;
      });

    // Sort posts by date (newest first)
    return allPosts.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

// Get a single post by ID
export function getPostById(id: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / 200) + ' min read';

    return {
      id,
      content,
      readTime,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      author: data.author || 'CVG Family Law',
      category: data.category || 'General',
      excerpt: data.excerpt || content.substring(0, 200) + '...',
      featured: data.featured || false,
      tags: data.tags || [],
      image: data.image || null,
    };
  } catch (error) {
    console.error('Error reading post:', error);
    return null;
  }
}

// Get posts by category
export function getPostsByCategory(category: string): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => 
    post.category.toLowerCase() === category.toLowerCase()
  );
}

// Get featured posts
export function getFeaturedPosts(): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.featured);
}

// Get recent posts
export function getRecentPosts(limit: number = 5): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.slice(0, limit);
}

// Search posts
export function searchPosts(query: string): BlogPost[] {
  const allPosts = getAllPosts();
  const searchTerm = query.toLowerCase();
  
  return allPosts.filter(post => {
    return (
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  });
}

// Get all categories
export function getAllCategories(): string[] {
  const allPosts = getAllPosts();
  const categories = new Set(allPosts.map(post => post.category));
  return Array.from(categories);
}

// Get all tags
export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tags = new Set(allPosts.flatMap(post => post.tags || []));
  return Array.from(tags);
}
