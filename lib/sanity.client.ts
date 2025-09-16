import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0f7hvf5c';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-01-01';
const token = process.env.SANITY_API_READ_TOKEN;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !token && process.env.NODE_ENV === 'production',
  perspective: 'published',
  token,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

export const queries = {
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
  allCategories: `*[_type == "category"] | order(title asc) {
    _id,
    title,
    description,
    "postCount": count(*[_type == "blogPost" && references(^._id)])
  }`,
  allAuthors: `*[_type == "author"] | order(name asc) {
    _id,
    name,
    image,
    bio,
    "postCount": count(*[_type == "blogPost" && references(^._id)])
  }`,
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
  emergencyResources: `*[_type == "emergencyResource" && area in ["Kent", "Tunbridge Wells", "Sevenoaks", $area]] | order(priority asc) {
    _id,
    title,
    phoneNumber,
    available247,
    description,
    area,
    category
  }`,
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

async function safeFetch<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  try {
    return await client.fetch(query, params);
  } catch (error) {
    console.error('Sanity fetch error', error);
    throw error;
  }
}

export const getAllPosts = () => safeFetch(queries.allPosts);
export const getPostBySlug = (slug: string) => safeFetch(queries.postBySlug, { slug });
export const getFeaturedPosts = () => safeFetch(queries.featuredPosts);
export const searchPosts = (searchTerm: string) => safeFetch(queries.searchPosts, { searchTerm });
export const getEmergencyResources = (area = 'Kent') => safeFetch(queries.emergencyResources, { area });
