import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { Member } from '../types';
import "../App.css"


type ModalMode = 'create' | 'edit';

const MembersPanel: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // form state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');

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

  const openCreateModal = () => {
    setModalMode('create');
    setEditingMember(null);
    setName('');
    setAddress('');
    setCity('');
    setPhone('');
    setIsModalOpen(true);
  };

  const openEditModal = (member: Member) => {
    setModalMode('edit');
    setEditingMember(member);
    setName(member.name);
    setAddress(member.address ?? '');
    setCity(member.city ?? '');
    setPhone(member.phone ?? '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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

    if (modalMode === 'create') {
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
    } else if (modalMode === 'edit' && editingMember) {
      const { data, error } = await supabase
        .from('members')
        .update(payload)
        .eq('id', editingMember.id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating member:', error.message);
        return;
      }

      setMembers(prev =>
        prev.map(m => (m.id === editingMember.id ? (data as Member) : m))
      );
    }

    closeModal();
  };

  const handleDelete = async (member: Member) => {
    if (!window.confirm(`Delete member "${member.name}"?`)) return;

    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', member.id);

    if (error) {
      console.error('Error deleting member:', error.message);
      return;
    }

    setMembers(prev => prev.filter(m => m.id !== member.id));
  };

  return (
    <div className="members-panel">
      <div className="members-header">
        <h2>Members</h2>
        <button onClick={openCreateModal}>+ Add new member</button>
      </div>

      {loading ? (
        <p>Loading members...</p>
      ) : (
        <ul className="members-list">
          {members.map(member => (
            <li key={member.id} className="members-list-item">
              <div>
                <strong>{member.name}</strong>
                <div className="members-meta">
                  {member.city && <span>{member.city}</span>}
                  {member.address && <span> · {member.address}</span>}
                </div>
                {member.phone && (
                  <div className="members-phone">{member.phone}</div>
                )}
              </div>
              <div className="members-actions">
                <button onClick={() => openEditModal(member)}>Edit</button>
                <button onClick={() => handleDelete(member)}>Delete</button>
              </div>
            </li>
          ))}
          {members.length === 0 && !loading && (
            <li>No members yet.</li>
          )}
        </ul>
      )}

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>
              {modalMode === 'create' ? 'Add new member' : 'Edit member'}
            </h3>
            <form onSubmit={handleSubmit}>
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
              <div className="modal-actions">
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit">
                  {modalMode === 'create' ? 'Add member' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersPanel;
