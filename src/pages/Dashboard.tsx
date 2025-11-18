import MembersPanel from '../panels/MembersPanel';
import BooksPanel from '../panels/BooksPanel';

export default function Dashboard() {
  return (
    <div className="dashboard-container">

      <div className="members-section">
        <MembersPanel />
      </div>

      <div className="books-section">
        <BooksPanel />
      </div>

    </div>
  );
}
