import React, { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react"; // Using Lucide icons

interface Author {
  name: string;
  isFollowing: boolean;
  image: string;
  sales?: number; // Added sales metric
  rating?: number; // Added rating
}

const TopSellers = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("https://randomuser.me/api/?results=5");
        if (!response.ok) throw new Error("Failed to fetch sellers");

        const data = await response.json();
        const authorsData: Author[] = data.results.map((user: any) => ({
          name: `${user.name.first} ${user.name.last}`,
          isFollowing: false,
          image: user.picture.large, // Using higher res image
          sales: Math.floor(Math.random() * 500) + 100, // Random sales data
          rating: (Math.random() * 2 + 3).toFixed(1), // Random rating 3-5
        }));
        setAuthors(authorsData);
      } catch (error) {
        console.error("Error fetching sellers:", error);
        setError("Failed to load top sellers. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFollow = (index: number) => {
    setAuthors((prev) =>
      prev.map((author, i) =>
        i === index ? { ...author, isFollowing: !author.isFollowing } : author
      )
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold mb-5">Top Sellers</h2>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between mb-4 animate-pulse"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-5 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold mb-5">Top Sellers</h2>
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-sm text-blue-600 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border w-full max-w-md mx-auto lg:mx-0 lg:mt-0">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">Top Sellers</h2>
        <button className="text-sm text-gray-500 hover:text-black">
          View All
        </button>
      </div>

      <ul className="space-y-4">
        {authors.map((author, index) => (
          <li key={index}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-10 h-10 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="font-medium truncate">{author.name}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{author.sales} sales</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      {author.rating}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleFollow(index)}
                className={`flex items-center space-x-1 py-1.5 px-3 rounded-full text-sm transition-colors ${
                  author.isFollowing
                    ? "bg-gray-100 text-gray-800 border border-gray-200"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
                aria-label={
                  author.isFollowing
                    ? `Unfollow ${author.name}`
                    : `Follow ${author.name}`
                }
              >
                {author.isFollowing ? (
                  <>
                    <Check size={14} />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopSellers;
