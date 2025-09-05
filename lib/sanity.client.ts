import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// TODO: Add your Sanity project details
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2024-01-01';

// Create the client for fetching data
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // `false` if you want to ensure fresh data
  perspective: 'published',
});

// Helper for generating image URLs
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// GROQ Queries for fetching content
export const queries = {
  // Get all blog posts
  allPosts: `*[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    featured,
    "author": author->name,
    "categories": categories[]->title,
    tags
  }`,

  // Get single post by slug
  postBySlug: `*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    mainImage,
    publishedAt,
    featured,
    "author": author->{name, image, bio},
    "categories": categories[]->title,
    tags,
    seoTitle,
    seoDescription
  }`,

  // Get featured posts
  featuredPosts: `*[_type == "blogPost" && featured == true] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    "author": author->name,
    "categories": categories[]->title
  }`,

  // Get posts by category
  postsByCategory: `*[_type == "blogPost" && references(*[_type=="category" && title == $category]._id)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    "author": author->name,
    "categories": categories[]->title,
    tags
  }`,

  // Get posts by tag
  postsByTag: `*[_type == "blogPost" && $tag in tags] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    "author": author->name,
    "categories": categories[]->title,
    tags
  }`,

  // Get all categories
  allCategories: `*[_type == "category"] | order(title asc) {
    _id,
    title,
    description,
    "postCount": count(*[_type == "blogPost" && references(^._id)])
  }`,

  // Get all authors
  allAuthors: `*[_type == "author"] | order(name asc) {
    _id,
    name,
    image,
    bio,
    "postCount": count(*[_type == "blogPost" && references(^._id)])
  }`,

  // Search posts
  searchPosts: `*[_type == "blogPost" && (
    title match $searchTerm + "*" ||
    excerpt match $searchTerm + "*" ||
    pt::text(body) match $searchTerm + "*" ||
    $searchTerm in tags
  )] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    "author": author->name,
    "categories": categories[]->title,
    tags
  }`,

  // Get emergency resources
  emergencyResources: `*[_type == "emergencyResource" && area in ["Kent", "Tunbridge Wells", "Sevenoaks", $area]] | order(priority asc) {
    _id,
    title,
    phoneNumber,
    available247,
    description,
    area,
    category
  }`,

  // Get local services
  localServices: `*[_type == "localService" && area in ["Kent", "Tunbridge Wells", "Sevenoaks", $area]] | order(name asc) {
    _id,
    name,
    serviceType,
    phoneNumber,
    email,
    address,
    website,
    description,
    area
  }`,
};

// Fetch functions with error handling
export async function getAllPosts() {
  try {
    const posts = await client.fetch(queries.allPosts);
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const post = await client.fetch(queries.postBySlug, { slug });
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getFeaturedPosts() {
  try {
    const posts = await client.fetch(queries.featuredPosts);
    return posts;
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await client.fetch(queries.searchPosts, { searchTerm });
    return posts;
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
}

export async function getEmergencyResources(area?: string) {
  try {
    const resources = await client.fetch(queries.emergencyResources, { area: area || 'Kent' });
    return resources;
  } catch (error) {
    console.error('Error fetching emergency resources:', error);
    return [];
  }
}
