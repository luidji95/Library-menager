import React from 'react';
import BooksPage from './BooksPages';
import MembersPage from './MembersPage';
import './dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="members-section">
        <MembersPage />
      </div>

      <div className="books-section">
        <BooksPage />
      </div>
    </div>
  );
}
