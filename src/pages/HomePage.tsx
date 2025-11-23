import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface EmployeeResponse {
  employee?: {
    id: number;
    emp_id: string;
    metadata: any;
  };
  error?: string;
}

export default function HomePage() {
  const [employeeId, setEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!employeeId.trim()) {
      setError('Please enter your employee ID');
      return;
    }

    setLoading(true);
    
    try {
      const apiUrl = `https://86ti27uyel.execute-api.ap-southeast-2.amazonaws.com/default/hk01?emp_id=${encodeURIComponent(employeeId.trim())}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: EmployeeResponse = await response.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      if (data.employee) {
        // Store employee data in sessionStorage
        sessionStorage.setItem('employeeId', employeeId.trim());
        sessionStorage.setItem('employeeData', JSON.stringify(data.employee));
        navigate('/category');
      } else {
        setError('Invalid response from server');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to verify employee. Please try again.');
      setLoading(false);
      console.error('API Error:', err);
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
            onChange={(e) => {
              setEmployeeId(e.target.value);
              setError(''); // Clear error when user types
            }}
            placeholder="e.g., 12193"
            required
            disabled={loading}
          />
        </div>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <div className="button-group">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Verifying...' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
}
