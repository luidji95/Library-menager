import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { Member } from '../types';

const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching members:', error.message);
      } else {
        setMembers(data as Member[]);
      }
      setLoading(false);
    };

    fetchMembers();
  }, []);

  const resetForm = () => {
    setName('');
    setAddress('');
    setCity('');
    setPhone('');
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      address: address || null,
      city: city || null,
      phone: phone || null,
    };

    if (editingId) {
      const { data, error } = await supabase
        .from('members')
        .update(payload)
        .eq('id', editingId)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating member:', error.message);
        return;
      }

      setMembers(prev =>
        prev.map(m => (m.id === editingId ? (data as Member) : m))
      );
    } else {
      const { data, error } = await supabase
        .from('members')
        .insert(payload)
        .select('*')
        .single();

      if (error) {
        console.error('Error inserting member:', error.message);
        return;
      }

      setMembers(prev => [...prev, data as Member]);
    }

    resetForm();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this member?')) return;

    const { error } = await supabase.from('members').delete().eq('id', id);
    if (error) {
      console.error('Error deleting member:', error.message);
      return;
    }

    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleEdit = (member: Member) => {
    setEditingId(member.id);
    setName(member.name);
    setAddress(member.address ?? '');
    setCity(member.city ?? '');
    setPhone(member.phone ?? '');
  };

  return (
    <div>
      <h2>Members</h2>

      <form onSubmit={handleSubmit} className="members-form">
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <button type="submit">
          {editingId ? 'Save changes' : 'Add member'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading members...</p>
      ) : (
        <table className="members-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>City</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.address ?? '-'}</td>
                <td>{member.city ?? '-'}</td>
                <td>{member.phone ?? '-'}</td>
                <td>
                  <button onClick={() => handleEdit(member)}>Edit</button>
                  <button onClick={() => handleDelete(member.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && !loading && (
              <tr>
                <td colSpan={5}>No members yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MembersPage;
