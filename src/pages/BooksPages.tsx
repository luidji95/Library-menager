import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { Book } from '../types';

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // FETCH
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching books:', error.message);
      } else {
        setBooks(data as Book[]);
      }
      setLoading(false);
    };

    fetchBooks();
  }, []);

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setYear('');
    setGenre('');
    setEditingId(null);
  };

  // ADD + EDIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const payload = {
      title,
      author,
      year: year ? Number(year) : null,
      genre: genre || null,
    };

    if (editingId) {
      // UPDATE
      const { data, error } = await supabase
        .from('books')
        .update(payload)
        .eq('id', editingId)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating book:', error.message);
        return;
      }

      setBooks(prev =>
        prev.map(b => (b.id === editingId ? (data as Book) : b))
      );
    } else {
      // INSERT
      const { data, error } = await supabase
        .from('books')
        .insert({
          ...payload,
          available: true,
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error inserting book:', error.message);
        return;
      }

      setBooks(prev => [...prev, data as Book]);
    }

    resetForm();
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this book?')) return;

    const { error } = await supabase.from('books').delete().eq('id', id);
    if (error) {
      console.error('Error deleting book:', error.message);
      return;
    }

    setBooks(prev => prev.filter(b => b.id !== id));
  };

  // EDIT – popuni form
  const handleEdit = (book: Book) => {
    setEditingId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setYear(book.year ? String(book.year) : '');
    setGenre(book.genre ?? '');
  };

  // TOGGLE AVAILABLE
  const toggleAvailable = async (book: Book) => {
    const { data, error } = await supabase
      .from('books')
      .update({ available: !book.available })
      .eq('id', book.id)
      .select('*')
      .single();

    if (error) {
      console.error('Error toggling availability:', error.message);
      return;
    }

    setBooks(prev =>
      prev.map(b => (b.id === book.id ? (data as Book) : b))
    );
  };

  return (
    <div>
      <h2>Books</h2>

      <form onSubmit={handleSubmit} className="books-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={e => setAuthor(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={e => setYear(e.target.value)}
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={e => setGenre(e.target.value)}
        />
        <button type="submit">
          {editingId ? 'Save changes' : 'Add book'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <table className="books-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Year</th>
              <th>Genre</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.year ?? '-'}</td>
                <td>{book.genre ?? '-'}</td>
                <td>
                  <button onClick={() => toggleAvailable(book)}>
                    {book.available ? 'Yes' : 'No'}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleEdit(book)}>Edit</button>
                  <button onClick={() => handleDelete(book.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {books.length === 0 && !loading && (
              <tr>
                <td colSpan={6}>No books yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BooksPage;
