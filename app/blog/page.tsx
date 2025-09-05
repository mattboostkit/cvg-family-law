import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, User, Search, TrendingUp, BookOpen, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Family Law Blog - Domestic Abuse Support & Legal Insights | CVG Family Law",
  description: "Expert insights on domestic abuse law, survivor resources, legal updates, and support guides for victims in Kent and South East England.",
};

// Sample blog posts data - in production, this would come from a CMS
const blogPosts = [
  {
    id: 1,
    title: "New Domestic Abuse Protection Orders: What Kent Residents Need to Know",
    excerpt: "Understanding the new DAPO system and how it provides stronger protection for domestic abuse victims across Tunbridge Wells, Sevenoaks, and Kent.",
    author: "CVG Family Law Team",
    date: "2025-01-15",
    readTime: "5 min read",
    category: "Legal Updates",
    featured: true,
    image: "/blog/dapo-orders.jpg",
    tags: ["Domestic Abuse", "Legal Protection", "Kent Law"],
  },
  {
    id: 2,
    title: "Emergency Housing Rights for Domestic Abuse Victims in Kent",
    excerpt: "Your rights to emergency accommodation and how to access safe housing through Kent County Council and local refuges.",
    author: "Sarah Mitchell",
    date: "2025-01-10",
    readTime: "7 min read",
    category: "Survivor Resources",
    featured: true,
    image: "/blog/emergency-housing.jpg",
    tags: ["Housing", "Emergency Support", "Kent Resources"],
  },
  {
    id: 3,
    title: "Building Your Evidence: A Guide for Domestic Abuse Survivors",
    excerpt: "Practical advice on safely documenting abuse, gathering evidence, and preparing for legal proceedings.",
    author: "CVG Legal Team",
    date: "2025-01-08",
    readTime: "10 min read",
    category: "Legal Guidance",
    featured: false,
    image: "/blog/evidence-guide.jpg",
    tags: ["Evidence", "Legal Process", "Safety Planning"],
  },
  {
    id: 4,
    title: "Financial Abuse: Recognizing the Signs and Getting Help",
    excerpt: "Understanding financial control tactics and how to regain your financial independence with support available in Tunbridge Wells and Sevenoaks.",
    author: "Michael Chen",
    date: "2025-01-05",
    readTime: "6 min read",
    category: "Understanding Abuse",
    featured: false,
    image: "/blog/financial-abuse.jpg",
    tags: ["Financial Abuse", "Economic Control", "Support"],
  },
  {
    id: 5,
    title: "Child Contact and Domestic Abuse: Protecting Your Children",
    excerpt: "How courts handle child arrangements when domestic abuse is involved, and your options for safe contact arrangements.",
    author: "CVG Family Law",
    date: "2025-01-03",
    readTime: "8 min read",
    category: "Children & Family",
    featured: false,
    image: "/blog/child-protection.jpg",
    tags: ["Children", "Child Arrangements", "Safety"],
  },
  {
    id: 6,
    title: "Kent Police Domestic Abuse Units: How They Can Help You",
    excerpt: "A comprehensive guide to working with Kent Police's specialist domestic abuse teams and what to expect when reporting abuse.",
    author: "Sarah Mitchell",
    date: "2024-12-28",
    readTime: "5 min read",
    category: "Local Resources",
    featured: false,
    image: "/blog/kent-police.jpg",
    tags: ["Kent Police", "Reporting Abuse", "Local Support"],
  },
];

const categories = [
  { name: "All Posts", count: 24 },
  { name: "Legal Updates", count: 8 },
  { name: "Survivor Resources", count: 6 },
  { name: "Local Resources", count: 5 },
  { name: "Understanding Abuse", count: 3 },
  { name: "Children & Family", count: 2 },
];

const popularTags = [
  "Domestic Abuse",
  "Kent Law",
  "Non-Molestation Orders",
  "Emergency Support",
  "Tunbridge Wells",
  "Sevenoaks",
  "Legal Aid",
  "Safety Planning",
  "Child Protection",
  "Housing Rights",
];

export default function BlogPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <TrendingUp className="h-4 w-4" />
              Kent&apos;s Leading Family Law Resource Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Domestic Abuse Support & Legal Insights
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Expert guidance, survivor resources, and legal updates for domestic abuse victims 
              in Tunbridge Wells, Sevenoaks, and across Kent.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles, guides, and resources..."
                  className="w-full px-6 py-4 pr-12 rounded-full border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-lg"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-colors">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="section-padding">
        <div className="container-main">
          <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {blogPosts.filter(post => post.featured).map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100"></div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 hover:text-purple-600 transition-colors">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                      <span>•</span>
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-1"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Main Blog Grid with Sidebar */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Blog Posts */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
              <div className="space-y-6">
                {blogPosts.filter(post => !post.featured).map((post) => (
                  <article key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex gap-4 p-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                            {post.category}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {new Date(post.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 hover:text-purple-600 transition-colors">
                          <Link href={`/blog/${post.id}`}>{post.title}</Link>
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
                        <Link
                          href={`/blog/${post.id}`}
                          className="text-purple-600 font-medium text-sm hover:text-purple-700 inline-flex items-center gap-1"
                        >
                          Read Article
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              
              {/* Pagination */}
              <div className="mt-8 flex justify-center gap-2">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                  1
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  2
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  3
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Emergency Help Widget */}
              <div className="bg-red-600 text-white rounded-xl p-6">
                <Shield className="h-8 w-8 mb-3" />
                <h3 className="text-xl font-bold mb-2">Need Urgent Help?</h3>
                <p className="text-sm mb-4 opacity-90">
                  If you&apos;re in immediate danger, call 999. For emergency legal advice:
                </p>
                <a
                  href="tel:07984782713"
                  className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors inline-block w-full text-center"
                >
                  07984 782 713
                </a>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.name}>
                      <Link
                        href={`/blog/category/${category.name.toLowerCase().replace(/ /g, '-')}`}
                        className="flex items-center justify-between py-2 px-3 rounded hover:bg-purple-50 transition-colors"
                      >
                        <span className="text-gray-700">{category.name}</span>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          {category.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Tags */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${tag.toLowerCase().replace(/ /g, '-')}`}
                      className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm hover:bg-purple-100 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6">
                <BookOpen className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="text-lg font-bold mb-2">Legal Updates Newsletter</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Get weekly updates on domestic abuse law and support resources in Kent.
                </p>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 rounded-lg border border-purple-200 mb-3"
                />
                <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Subscribe
                </button>
                <p className="text-xs text-gray-600 mt-2">
                  Unsubscribe anytime. Privacy guaranteed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white section-padding">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need Legal Advice About Your Situation?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Our specialist domestic abuse solicitors are here to help. 
            Book a free, confidential consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              Book Free Consultation
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="tel:07984782713"
              className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors inline-flex items-center justify-center gap-2"
            >
              Call 07984 782 713
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
