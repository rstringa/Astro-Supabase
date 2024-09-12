const PUBLIC_WORDPRESS_API_URL = import.meta.env.PUBLIC_WORDPRESS_API_URL;
const query = `
  {
    posts(first: 15) {
      nodes {
        title
        slug
        categories {
          nodes {
            databaseId 
            slug
            name
          }
        }
        featuredImage {
          node {
            sourceUrl(size: LARGE)
          }
        }
      }
    }
  }
`;
async function getTrending() {
  
  const res = await fetch(`${PUBLIC_WORDPRESS_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

    },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  return data;
}
const trendingDataFunc = await getTrending();
export const postsData = trendingDataFunc.data.posts.nodes;
