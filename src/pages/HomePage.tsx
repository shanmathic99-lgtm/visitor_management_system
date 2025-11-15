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
      <h2 className="page-title">Visitor Registration</h2>
      <p style={{ textAlign: 'center', color: '#718096', marginBottom: '2.5rem', fontSize: '1.0625rem' }}>
        Please enter your employee ID to proceed with visitor registration
      </p>
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
            placeholder="e.g., EMP-12345"
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
