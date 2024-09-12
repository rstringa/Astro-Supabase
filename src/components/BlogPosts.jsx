import { useEffect, useState } from 'react';
import { postsData } from '@data/getPosts';
import './BlogPosts.css';

export default function BlogPosts({ first, last, type = "card" }) {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
   
    const fetchData = async () => {
      try {
        setBlogPosts(postsData); 
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    
    fetchData();
    const intervalId = setInterval(fetchData, 60 * 1000);

    // Clean up the interval when the component unmounts to prevent memory leaks
    return () => clearInterval(intervalId);

  }, []);


  {!loading && blogPosts.length > 0 && (
    blogPosts.map((post, index) => {
      if (index >= (first - 1) && last && index < last) {
        const categories = post.categories?.nodes || [];
        const categorySlugs = categories.map(category => category.slug);
        const categoryNames = categories.map(category => category.name);
        const categoryIds = categories.map(category => category.databaseId);
        const postType = 'card';
  
        return (
          <article
            key={index}
            className={[
              `${postType}-note`,
              `note-${index}`,
              ...categoryIds.map((id) => `cat-${id}`),
            ].join(' ')}
          >
            <a href={`/${post.slug}`}>
              {post.featuredImage?.node?.sourceUrl ? (
                <img
                  className="zoomIn"
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.title}
                  width="800"
                  height="600"
                />
              ) : (
                <img
                  src={fallback.src}
                  width={fallback.width}
                  height={fallback.height}
                  alt="Fallback"
                />
              )}
            </a>
            <div className="text">
              <div className="label-box">
                {categoryIds.map((categoryId, index) => (
                  <a href={`/secciones/${categorySlugs[index]}`} key={index}>
                    <h4 className="label">{categoryNames[index]}</h4>
                  </a>
                ))}
              </div>
              <h2 className="title">
                <a href={post.slug}>{post.title}</a>
              </h2>
            </div>
          </article>
        );
      }
    })
  )}


}
