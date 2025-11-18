import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { Book } from '../types';
import "../App.css"

type ModalMode = 'create' | 'edit';

const BooksPanel: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [available, setAvailable] = useState(true);

  // FETCH books
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

  const openCreateModal = () => {
    setModalMode('create');
    setEditingBook(null);
    setTitle('');
    setAuthor('');
    setYear('');
    setGenre('');
    setAvailable(true);
    setIsModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setModalMode('edit');
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setYear(book.year ? String(book.year) : '');
    setGenre(book.genre ?? '');
    setAvailable(book.available);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // CREATE + EDIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const payload = {
      title,
      author,
      year: year ? Number(year) : null,
      genre: genre || null,
      available,
    };

    if (modalMode === 'create') {
      const { data, error } = await supabase
        .from('books')
        .insert(payload)
        .select('*')
        .single();

      if (error) {
        console.error('Error inserting book:', error.message);
        return;
      }

      setBooks(prev => [...prev, data as Book]);
    }

    if (modalMode === 'edit' && editingBook) {
      const { data, error } = await supabase
        .from('books')
        .update(payload)
        .eq('id', editingBook.id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating book:', error.message);
        return;
      }

      setBooks(prev =>
        prev.map(b => (b.id === editingBook.id ? (data as Book) : b))
      );
    }

    closeModal();
  };

  // DELETE
  const handleDelete = async (book: Book) => {
    if (!window.confirm(`Delete "${book.title}"?`)) return;

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', book.id);

    if (error) {
      console.error('Error deleting book:', error.message);
      return;
    }

    setBooks(prev => prev.filter(b => b.id !== book.id));
  };

  // Toggle availability (Yes/No)
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
    <div className="books-panel">
      <div className="books-header">
        <h2>Books</h2>
        <button onClick={openCreateModal}>+ Add new book</button>
      </div>

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
                  <button onClick={() => openEditModal(book)}>Edit</button>
                  <button onClick={() => handleDelete(book)}>Delete</button>
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

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{modalMode === 'create' ? 'Add new book' : 'Edit book'}</h3>

            <form onSubmit={handleSubmit}>
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

              <label style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input
                  type="checkbox"
                  checked={available}
                  onChange={e => setAvailable(e.target.checked)}
                />
                Available
              </label>

              <div className="modal-actions">
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit">
                  {modalMode === 'create' ? 'Add book' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksPanel;
