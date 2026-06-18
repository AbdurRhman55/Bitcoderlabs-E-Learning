import BlogHero from "./BlogHeroCOmponent";

function BlogDetailPage({ blog }) {
  if (!blog) return null;
  return (
    <div>
      <BlogHero
        title={blog.title}
        author={blog.author || "BitCoderLabs"}
        date={blog.date || blog.created_at || "Recently"}
        coverImage={blog.image}
      />
    </div>
  );
}

export default BlogDetailPage;
