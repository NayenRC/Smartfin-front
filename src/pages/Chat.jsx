import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Plus, Trash2, Edit2, Loader } from 'lucide-react';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state for creating/editing
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await api.get('/articles');
      setArticles(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching articles:', err);
      // Fallback data for demonstration if backend is not running
      // setArticles([{ id: 1, title: 'Demo Article', content: 'Backend not connected yet.' }]);
      setError('Failed to load articles. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    try {
      if (isEditing) {
        await api.put(`/articles/${editId}`, formData);
        setArticles(
          articles.map((art) =>
            art.id === editId ? { ...art, ...formData } : art,
          ),
        );
        setIsEditing(false);
        setEditId(null);
      } else {
        const response = await api.post('/articles', formData);
        setArticles([...articles, response.data]);
      }
      setFormData({ title: '', content: '' });
      setError(null);
    } catch (err) {
      setError(
        isEditing ? 'Failed to update article.' : 'Failed to create article.',
      );
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?'))
      return;
    try {
      await api.delete(`/articles/${id}`);
      setArticles(articles.filter((art) => art.id !== id));
    } catch (err) {
      setError('Failed to delete article.');
    }
  };

  const handleEdit = (article) => {
    setFormData({ title: article.title, content: article.content });
    setIsEditing(true);
    setEditId(article.id);
  };

  const handleCancel = () => {
    setFormData({ title: '', content: '' });
    setIsEditing(false);
    setEditId(null);
  };

  if (loading)
    return (
      <div className="text-center py-10">
        <Loader className="animate-spin h-8 w-8 mx-auto text-blue-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Articles (CRUD Example)
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Create/Edit Form */}
      <Card
        title={isEditing ? 'Edit Article' : 'Create New Article'}
        className="mb-8"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Article Title"
            required
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Content</label>
            <textarea
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Article Content"
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="primary">
              {isEditing ? (
                'Update Article'
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1 inline" /> Create Article
                </>
              )}
            </Button>
            {isEditing && (
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* List of Articles */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-10">
            No articles found. Create one above!
          </div>
        ) : (
          articles.map((article) => (
            <Card key={article.id} className="flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 line-clamp-3">{article.content}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleEdit(article)}
                  className="p-2"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(article.id)}
                  className="p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Articles;
