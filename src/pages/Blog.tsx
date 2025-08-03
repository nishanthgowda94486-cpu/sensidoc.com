import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Calendar, 
  User, 
  Tag, 
  ArrowRight, 
  Clock,
  BookOpen,
  TrendingUp,
  Heart,
  MessageCircle
} from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  featured_image: string
  created_at: string
  author: {
    full_name: string
  }
  read_time: number
  views: number
  likes: number
  comments: number
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Understanding Mental Health: A Comprehensive Guide',
      excerpt: 'Mental health is as important as physical health. Learn about common mental health conditions, symptoms, and treatment options available.',
      content: 'Mental health encompasses our emotional, psychological, and social well-being...',
      category: 'Mental Health',
      tags: ['mental health', 'wellness', 'psychology', 'therapy'],
      featured_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
      created_at: '2024-01-15T10:00:00Z',
      author: { full_name: 'Dr. Sarah Johnson' },
      read_time: 8,
      views: 1247,
      likes: 89,
      comments: 23
    },
    {
      id: '2',
      title: 'The Future of AI in Healthcare: What to Expect',
      excerpt: 'Artificial Intelligence is revolutionizing healthcare delivery. Discover how AI is improving diagnosis accuracy and patient outcomes.',
      content: 'Artificial Intelligence has become a game-changer in modern healthcare...',
      category: 'Technology',
      tags: ['AI', 'healthcare', 'technology', 'innovation'],
      featured_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
      created_at: '2024-01-12T14:30:00Z',
      author: { full_name: 'Dr. Michael Chen' },
      read_time: 12,
      views: 2156,
      likes: 156,
      comments: 45
    },
    {
      id: '3',
      title: 'Nutrition Myths Debunked: Evidence-Based Facts',
      excerpt: 'Separate fact from fiction in nutrition. Learn about evidence-based dietary recommendations and common misconceptions.',
      content: 'Nutrition science is constantly evolving, and with it comes many myths...',
      category: 'Nutrition',
      tags: ['nutrition', 'diet', 'health', 'wellness'],
      featured_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
      created_at: '2024-01-10T09:15:00Z',
      author: { full_name: 'Dr. Emily Rodriguez' },
      read_time: 6,
      views: 1893,
      likes: 134,
      comments: 31
    },
    {
      id: '4',
      title: 'Preventive Care: Your Guide to Staying Healthy',
      excerpt: 'Prevention is better than cure. Learn about essential preventive care measures and screenings for different age groups.',
      content: 'Preventive care is the foundation of good health and longevity...',
      category: 'Preventive Care',
      tags: ['prevention', 'screening', 'health', 'wellness'],
      featured_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
      created_at: '2024-01-08T16:45:00Z',
      author: { full_name: 'Dr. James Wilson' },
      read_time: 10,
      views: 1678,
      likes: 98,
      comments: 28
    },
    {
      id: '5',
      title: 'Managing Chronic Pain: Modern Approaches',
      excerpt: 'Chronic pain affects millions worldwide. Explore modern treatment approaches and pain management strategies.',
      content: 'Chronic pain is a complex condition that requires a multidisciplinary approach...',
      category: 'Pain Management',
      tags: ['pain', 'chronic pain', 'treatment', 'management'],
      featured_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
      created_at: '2024-01-05T11:20:00Z',
      author: { full_name: 'Dr. Lisa Thompson' },
      read_time: 9,
      views: 1432,
      likes: 112,
      comments: 37
    },
    {
      id: '6',
      title: 'Digital Health: Telemedicine and Remote Care',
      excerpt: 'The rise of telemedicine is transforming healthcare access. Learn about the benefits and future of remote healthcare.',
      content: 'Digital health technologies are making healthcare more accessible than ever...',
      category: 'Technology',
      tags: ['telemedicine', 'digital health', 'remote care', 'technology'],
      featured_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
      created_at: '2024-01-03T13:10:00Z',
      author: { full_name: 'Dr. Robert Kim' },
      read_time: 7,
      views: 1987,
      likes: 145,
      comments: 42
    }
  ]

  const mockCategories = [
    { name: 'Mental Health', count: 12 },
    { name: 'Technology', count: 8 },
    { name: 'Nutrition', count: 15 },
    { name: 'Preventive Care', count: 10 },
    { name: 'Pain Management', count: 6 },
    { name: 'Cardiology', count: 9 },
    { name: 'Pediatrics', count: 11 },
    { name: 'Oncology', count: 7 }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts(mockPosts)
      setCategories(mockCategories)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchesCategory = !selectedCategory || post.category === selectedCategory
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Healthcare Insights & Knowledge
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Stay informed with the latest healthcare trends, medical research, and wellness tips from our expert medical professionals.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search articles, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-gray-900 border-0 rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Categories */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-blue-600" />
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      !selectedCategory 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    All Categories ({posts.length})
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category.name 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Topics */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                  Trending Topics
                </h3>
                <div className="space-y-3">
                  {['AI in Healthcare', 'Mental Wellness', 'Preventive Medicine', 'Digital Health', 'Nutrition Science'].map((topic) => (
                    <div key={topic} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                      <span className="text-sm text-gray-700">{topic}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory ? `${selectedCategory} Articles` : 'All Articles'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                  <option>Latest</option>
                  <option>Most Popular</option>
                  <option>Most Viewed</option>
                </select>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(post.created_at)}
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1" />
                      {post.read_time} min read
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        {post.author.full_name}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {post.views}
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likes}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link to={`/blog/${post.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {filteredPosts.length > 0 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-blue-600 text-white border-blue-600">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </nav>
              </div>
            )}

            {/* No Results */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or browse our categories.
                </p>
                <Button onClick={() => { setSearchQuery(''); setSelectedCategory(''); }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog 