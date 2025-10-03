import React, { useEffect, useState } from "react";
import axios from "axios";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:5000/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>All Posts</h2>
      {posts.map(post => <Post key={post._id} id={post._id} />)}
    </div>
  );
};

const Post = ({ id }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`http://localhost:5000/posts/${id}`);
      setPost(res.data);
    };
    fetchPost();
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
      <h3>{post.title}</h3>
      {post.fields.map((f, idx) => (
        <div key={idx}>
          <strong>{f.name}:</strong>{" "}
          {f.type === "image" && typeof f.value === "string" ? (
            <img src={f.value} alt={f.name} style={{ maxWidth: "200px", maxHeight: "200px" }} />
          ) : (
            <span>{f.value?.toString()}</span>
          )}
        </div>
      ))}
      <small>Created: {new Date(post.createdAt).toLocaleString()}</small>
    </div>
  );
};

export default PostList;
