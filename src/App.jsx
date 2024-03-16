import { useEffect, useState } from "react";
import api from "./api/axios";


function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPostId, setEditingPostId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await api.post('/posts', formData);
      console.log('Response:', response.data);
      fetchData();
      setFormData({ name: '', email: '' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (id, post) => {
    setEditingPostId(id);
    setFormData(post);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/posts/${editingPostId}`, formData);
      fetchData();
      setFormData({ name: '', email: '' });
      setEditingPostId(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create Post</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col mb-4">
          <label className="text-gray-700">Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div className="flex flex-col mb-4">
          <label className="text-gray-700">Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600">Submit</button>
      </form>

      <h2 className="text-3xl font-bold mb-4">Posts</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full mb-8">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td className="px-4 py-2">{post.name}</td>
                <td className="px-4 py-2">{post.email}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleEdit(post.id, post)} className="mr-2">Edit</button>
                  <button onClick={() => handleDelete(post.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editingPostId && (
        <div>
          <h2 className="text-3xl font-bold mb-4">Edit Post</h2>
          <form onSubmit={handleUpdate} className="mb-8">
            <div className="flex flex-col mb-4">
              <label className="text-gray-700">Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-gray-700">Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600">Update</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
