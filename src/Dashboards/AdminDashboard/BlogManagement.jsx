import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  selectBlogs,
} from "../../../slices/blogSlice";
import Button from "../../Component/UI/Button";
import ImageUpload from "../../Component/UI/ImageUpload";
import {
  Edit2,
  Trash2,
  Plus,
  X,
  Loader,
  Search,
  FileText,
} from "lucide-react";
import { API_ORIGIN } from "../../api/index";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM5Y2EzYWYiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZHk9Ii4zZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");

const initialFormState = {
  title: "",
  slug: "",
  description: "",
  category: "",
  content: "",
  image: null,
  status: "draft",
  author_name: "",
  author_id: "",
  read_time: "",
  published_at: "",
  is_featured: false,
  trending: false,
  is_new: false,
};

export default function BlogManagement() {
  const dispatch = useDispatch();
  const blogs = useSelector(selectBlogs);
  const currentUser = useSelector((state) => state.auth.user);
  const { loading } = useSelector((state) => state.blogs);

  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchBlogs({ per_page: 100 }));
  }, [dispatch]);

  const resolveImageUrl = (image) => {
    if (!image) return null;
    if (typeof image !== "string") return null;
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    return `${API_ORIGIN}/storage/${image.replace(/^\//, "")}`;
  };

  const openAddForm = () => {
    setEditingBlog(null);
    setFormData({
      ...initialFormState,
      author_name: currentUser?.name || "",
      author_id: currentUser?.id || "",
      status: "published",
    });
    setImagePreview(null);
    setShowForm(true);
  };

  const openEditForm = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      description: blog.description || "",
      category: blog.category || "",
      content: blog.content || "",
      status: blog.is_active ? "published" : "draft",
      author_name: blog.author_name || blog.author || "",
      author_id: blog.author_id || "",
      read_time: blog.read_time || "",
      published_at: blog.published_at || "",
      is_featured: blog.is_featured ?? false,
      trending: blog.trending ?? false,
      is_new: blog.is_new ?? false,
      image: null,
    });
    setImagePreview(resolveImageUrl(blog.image));
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" && !editingBlog ? { slug: slugify(value) } : {}),
    }));
  };

  const handleImageChange = (file) => {
    setFormData((prev) => ({ ...prev, image: file }));
    if (file instanceof File) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(resolveImageUrl(file));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = formData.title.trim();
    const description = formData.description.trim();
    const content = formData.content.trim();
    const slug = (formData.slug || slugify(formData.title)).trim();
    const authorName = (formData.author_name || currentUser?.name || "").trim();

    if (!title || !description || !content) {
      alert("Title, description, and content are required.");
      return;
    }

    if (!slug) {
      alert("A slug is required.");
      return;
    }

    if (!authorName) {
      alert("Author name is required.");
      return;
    }

    setSubmitting(true);
    try {
      let submitData;

      if (formData.image && formData.image instanceof File) {
        const payloadData = new FormData();
        payloadData.append("title", title);
        payloadData.append("slug", slug);
        payloadData.append("description", description);
        if (formData.category) payloadData.append("category", formData.category);
        payloadData.append("content", content);
        payloadData.append("author_name", authorName);
        if (formData.author_id || currentUser?.id) payloadData.append("author_id", String(formData.author_id || currentUser?.id));
        if (formData.read_time) payloadData.append("read_time", formData.read_time);
        if (formData.published_at) payloadData.append("published_at", formData.published_at);
        payloadData.append("is_active", formData.status === "published" ? "1" : "0");
        payloadData.append("is_featured", formData.is_featured ? '1' : '0');
        payloadData.append("trending", formData.trending ? '1' : '0');
        payloadData.append("is_new", formData.is_new ? '1' : '0');
        payloadData.append("image", formData.image);
        
        submitData = payloadData;
      } else {
        const cleanPayload = {
          title,
          slug,
          description,
          category: formData.category,
          content,
          author_name: authorName,
          author_id: formData.author_id ? Number(formData.author_id) : currentUser?.id || undefined,
          read_time: formData.read_time || undefined,
          published_at: formData.published_at || undefined,
          is_active: formData.status === "published",
          is_featured: formData.is_featured,
          trending: formData.trending,
          is_new: formData.is_new,
        };
        submitData = cleanPayload;
      }

      if (editingBlog) {
        await dispatch(updateBlog({ id: editingBlog.id, data: submitData })).unwrap();
      } else {
        await dispatch(createBlog(submitData)).unwrap();
      }
      setShowForm(false);
      setEditingBlog(null);
      setFormData(initialFormState);
      setImagePreview(null);
    } catch (err) {
      console.error("Blog submit error:", err);
      if (err.message) alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteBlog(id)).unwrap();
      setConfirmDelete(null);
    } catch (err) {
      console.error("Blog delete error:", err);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (blog.title || "").toLowerCase().includes(q) ||
      (blog.category || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage your blog posts ({blogs.length} total)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
            />
          </div>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Add Blog
          </button>
        </div>
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No blogs found</h3>
            <p className="text-gray-500 text-sm">
              {searchQuery ? "Try a different search term" : "Click \"Add Blog\" to create your first post"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <img
                        src={resolveImageUrl(blog.image) || PLACEHOLDER_IMAGE}
                        alt={blog.title}
                        className="w-16 h-12 rounded-lg object-cover border border-gray-200"
                        onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 text-sm truncate max-w-xs">
                        {blog.title}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5 truncate max-w-xs">
                        {blog.description}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {blog.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        blog.is_active
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}>
                        {blog.is_active ? "published" : "draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(blog)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(blog.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingBlog ? "Edit Blog" : "Add New Blog"}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      placeholder="Enter blog title"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      placeholder="e.g. Web Dev, AI, Career"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Author Name *</label>
                    <input
                      type="text"
                      name="author_name"
                      value={formData.author_name}
                      onChange={handleFormChange}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug * (auto-generated)</label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleFormChange}
                      placeholder="my-blog-title"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500"
                      readOnly={!editingBlog}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Brief description of the blog post"
                      rows="3"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Content *</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleFormChange}
                      placeholder="Full blog content (HTML or markdown supported)"
                      rows="6"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Author ID</label>
                    <input
                      type="number"
                      name="author_id"
                      value={formData.author_id}
                      onChange={handleFormChange}
                      placeholder="e.g. 1"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Read Time</label>
                    <input
                      type="text"
                      name="read_time"
                      value={formData.read_time}
                      onChange={handleFormChange}
                      placeholder="e.g. 5 min read"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Published At</label>
                    <input
                      type="datetime-local"
                      name="published_at"
                      value={formData.published_at}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="trending"
                        checked={formData.trending}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Trending</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_new"
                        checked={formData.is_new}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">New</span>
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <ImageUpload
                      value={formData.image || imagePreview}
                      onChange={handleImageChange}
                      label="Blog Image"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {submitting && <Loader size={16} className="animate-spin" />}
                    {editingBlog ? "Update Blog" : "Create Blog"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={() => setConfirmDelete(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Blog</h3>
              <p className="text-gray-600 text-sm mb-6">
                Are you sure you want to delete this blog? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
