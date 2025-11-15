import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [employeeId, setEmployeeId] = useState('');
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId.trim()) {
      sessionStorage.setItem('employeeId', employeeId);
      navigate('/category');
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Welcome to Visitor Management System</h2>
      <form onSubmit={handleNext}>
        <div className="form-group">
          <label className="form-label" htmlFor="employeeId">
            Employee Number/ID
          </label>
          <input
            type="text"
            id="employeeId"
            className="form-input"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Enter your employee ID"
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="btn btn-primary">
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
