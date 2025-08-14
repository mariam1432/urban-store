import { MessageCircle, ThumbsUp, ArrowRight } from "lucide-react";

interface Blog {
  title: string;
  author: string;
  likes: number;
  comments: number;
  date?: string;
  readTime?: string;
}

const PopularBlogs = () => {
  const blogs: Blog[] = [
    {
      title: "10 Must-Have Summer Fashion Essentials",
      author: "Jane Smith",
      likes: 245,
      comments: 28,
      date: "May 15, 2023",
      readTime: "5 min read",
    },
    {
      title: "The Best Budget-Friendly Grocery Shopping Tips",
      author: "Mike Johnson",
      likes: 189,
      comments: 15,
      date: "April 28, 2023",
      readTime: "4 min read",
    },
    {
      title: "Luxury Handbags Worth the Investment",
      author: "Sarah Williams",
      likes: 312,
      comments: 42,
      date: "June 2, 2023",
      readTime: "7 min read",
    },
    {
      title: "Eco-Friendly Shopping: Reducing Your Carbon Footprint",
      author: "David Green",
      likes: 276,
      comments: 31,
      date: "May 22, 2023",
      readTime: "6 min read",
    },
    {
      title: "Online vs In-Store Shopping: Pros and Cons",
      author: "Lisa Chen",
      likes: 154,
      comments: 19,
      date: "April 10, 2023",
      readTime: "3 min read",
    },
  ];

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border w-full max-w-md mx-auto lg:mx-0 mt-6 lg:mt-0">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">Popular Blogs</h2>
        <button className="flex items-center text-sm text-gray-500 hover:text-black">
          View All <ArrowRight size={16} className="ml-1" />
        </button>
      </div>

      <ul className="space-y-5">
        {blogs.map((blog, index) => (
          <li key={index} className="pb-4 border-b last:border-b-0 last:pb-0">
            <div className="group">
              <h3 className="font-bold mb-1 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                {blog.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>By {blog.author}</span>
                <span className="mx-2">•</span>
                <span>{blog.date}</span>
              </div>
              <p className="text-sm text-gray-500 mb-3">{blog.readTime}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <ThumbsUp size={16} className="mr-1" />
                    <span>{blog.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MessageCircle size={16} className="mr-1" />
                    <span>{blog.comments.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  className="text-sm text-blue-600 hover:underline flex items-center"
                  aria-label={`Read ${blog.title}`}
                >
                  Read more
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularBlogs;
