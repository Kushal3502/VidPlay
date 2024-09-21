import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0], // For file inputs
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create a FormData object to handle the form submission
    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("fullname", formData.fullname);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("avatar", formData.avatar); // Assuming file inputs are set correctly
    formDataToSend.append("coverImage", formData.coverImage); // Assuming file inputs are set correctly
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/users/register", {
        method: "POST",
        body: formDataToSend,
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Fullname:</label>
        <input
          type="text"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Avatar:</label>
        <input type="file" name="avatar" onChange={handleChange} />
      </div>

      <div>
        <label>Cover Image:</label>
        <input type="file" name="coverImage" onChange={handleChange} />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default App;
