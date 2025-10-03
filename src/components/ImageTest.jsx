// src/components/ImageTest.jsx
import { useEffect, useState } from "react";

export default function ImageTest({ filename }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (filename) {
      // Decide whether it's an ObjectId or a plain filename
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(filename);
      const url = isObjectId
        ? `http://localhost:5000/api/images/${filename}` // by fileId
        : `http://localhost:5000/api/images/filename/${filename}`; // by filename

      console.log("🔗 Image URL set:", url);
      setSrc(url);
    }
  }, [filename]);

  if (!filename) {
    console.warn("⚠️ No filename provided to <ImageTest />");
    return <p>No filename provided</p>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h3>Image Debug</h3>
      <p>Filename: {filename}</p>
      {src ? (
        <img
          src={src}
          alt="Vehicle"
          style={{ width: "400px", border: "1px solid #ccc" }}
          onLoad={() => console.log("✅ Image loaded successfully:", src)}
          onError={(e) => {
            console.error("❌ Failed to load image:", src);
            e.currentTarget.src =
              "https://source.unsplash.com/400x250/?car"; // fallback
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
