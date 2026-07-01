import { API_ORIGIN } from "../api/index.js";

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value || "");

export const resolveBlogImageUrl = (image) => {
  if (!image || typeof image !== "string") {
    return "";
  }

  if (isAbsoluteUrl(image)) {
    return image;
  }

  return `${API_ORIGIN}/storage/${image.replace(/^\/+/, "")}`;
};

export const formatBlogDate = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value : "";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getRawBlog = (blog) => {
  if (!blog || typeof blog !== "object") return null;
  return blog;
};

export const normalizeBlog = (blog) => {
  const raw = getRawBlog(blog);
  if (!raw) return null;

  const publishedSource = raw.published_at || raw.created_at || raw.date || "";
  const imagePath = raw.image || raw.cover_image || raw.coverImage || "";
  const authorName = raw.author_name || raw.author || raw.authorName || "";
  const readTime = raw.read_time || raw.readTime || "";

  return {
    ...raw,
    image: resolveBlogImageUrl(imagePath),
    imageUrl: resolveBlogImageUrl(imagePath),
    author: authorName,
    author_name: authorName,
    date: raw.date || formatBlogDate(publishedSource),
    published_at: raw.published_at || raw.created_at || null,
    readTime,
    read_time: readTime,
    isNew: Boolean(raw.is_new ?? raw.isNew ?? false),
    is_new: Boolean(raw.is_new ?? raw.isNew ?? false),
    isFeatured: Boolean(raw.is_featured ?? raw.isFeatured ?? false),
    is_featured: Boolean(raw.is_featured ?? raw.isFeatured ?? false),
    trending: Boolean(raw.trending ?? false),
    views_count: Number(raw.views_count ?? raw.viewsCount ?? 0),
    likes_count: Number(raw.likes_count ?? raw.likesCount ?? 0),
  };
};

const extractListItems = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.results)) return response.results;
  return [];
};

const extractPagination = (response) => {
  const meta = response?.meta || response?.data?.meta || response?.pagination || {};
  const links = response?.links || response?.data?.links || null;

  const currentPage = Number(meta.current_page ?? meta.currentPage ?? 1);
  const lastPage = Number(meta.last_page ?? meta.lastPage ?? 1);
  const perPage = Number(meta.per_page ?? meta.perPage ?? 15);
  const total = Number(meta.total ?? 0);
  const from = Number(meta.from ?? 0);
  const to = Number(meta.to ?? 0);

  return {
    current_page: currentPage,
    last_page: lastPage,
    per_page: perPage,
    total,
    from,
    to,
    links,
    hasMore: currentPage < lastPage,
  };
};

export const normalizeBlogListResponse = (response) => {
  const items = extractListItems(response)
    .map(normalizeBlog)
    .filter(Boolean);

  return {
    items,
    pagination: extractPagination(response),
  };
};

export const normalizeBlogResponse = (response) => {
  const raw = response?.data?.data || response?.data || response;
  return normalizeBlog(raw);
};
