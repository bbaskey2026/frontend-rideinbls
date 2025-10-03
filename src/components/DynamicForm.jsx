import React, { useState } from "react";
import axios from "axios";

const DynamicForm = ({ onPostCreated }) => {
  // Form state
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState([
    { name: "description", label: "Description", type: "text", value: "" },
    { name: "publishDate", label: "Publish Date", type: "date", value: "" },
    { name: "rating", label: "Rating", type: "number", value: "" },
    { name: "featuredImage", label: "Image", type: "file", value: null }
  ]);

  // Handle input changes
  const handleChange = (index, e) => {
    const newFields = [...fields];
    newFields[index].value = e.target.type === "file" ? e.target.files[0] : e.target.value;
    setFields(newFields);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);

      // Prepare fields JSON for backend (file value is null)
      const fieldsToSend = fields.map(f => ({
        name: f.name,
        type: f.type,
        value: f.type === "file" ? null : f.value
      }));

      formData.append("fields", JSON.stringify(fieldsToSend));

      // Attach files separately
      fields.forEach(f => {
        if (f.type === "file" && f.value) {
          formData.append(f.name, f.value);
        }
      });

      // Send POST request
      await axios.post("http://localhost:5000/posts", formData);

      alert("Post created successfully!");

      // Reset form
      setTitle("");
      setFields(fields.map(f => ({ ...f, value: f.type === "file" ? null : "" })));

      // Notify parent to refresh post list
      onPostCreated();

    } catch (err) {
      console.error(err);
      alert("Error creating post");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h2>Create Post</h2>

      {/* Title */}
      <div style={{ marginBottom: "10px" }}>
        <label>Title: </label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>

      {/* Dynamic fields */}
      {fields.map((f, idx) => (
        <div key={idx} style={{ marginBottom: "10px" }}>
          <label>{f.label}: </label>
          {f.type === "text" || f.type === "number" || f.type === "date" ? (
            <input type={f.type} value={f.value} onChange={e => handleChange(idx, e)} />
          ) : f.type === "file" ? (
            <input type="file" onChange={e => handleChange(idx, e)} />
          ) : null}
        </div>
      ))}

      <button type="submit">Create Post</button>
    </form>
  );
};

export default DynamicForm;
