import BlogHero from "./BlogHeroCOmponent";
import { formatBlogDate } from "../../utils/blogAdapter";

function BlogDetailPage({ blog }) {
  if (!blog) return null;
  return (
    <div>
      <BlogHero
        title={blog.title}
        author={blog.author_name || blog.author || "BitCoderLabs"}
        date={formatBlogDate(blog.published_at || blog.created_at || blog.date) || "Recently"}
        coverImage={blog.image}
      />
    </div>
  );
}

export default BlogDetailPage;
