import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PassPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [passKey, setPassKey] = useState('');

  useEffect(() => {
    const generatedKey = Math.random().toString(36).substring(2, 12).toUpperCase();
    setPassKey(generatedKey);
  }, []);

  const { category, visitorType, visitors, companyName, purposeOfVisit } = location.state || {};

  if (!category) {
    navigate('/');
    return null;
  }

  const handleNewVisitor = () => {
    navigate('/');
  };

  return (
    <div className="page-container">
      <div className="qr-pass-container">
        <h2 className="page-title">Visitor Pass Generated Successfully</h2>

        <div className="qr-code">
          <svg viewBox="0 0 100 100" width="200" height="200">
            <rect x="0" y="0" width="100" height="100" fill="white"/>
            <rect x="10" y="10" width="15" height="15" fill="black"/>
            <rect x="30" y="10" width="5" height="5" fill="black"/>
            <rect x="40" y="10" width="10" height="10" fill="black"/>
            <rect x="55" y="10" width="5" height="5" fill="black"/>
            <rect x="75" y="10" width="15" height="15" fill="black"/>
            <rect x="10" y="30" width="5" height="5" fill="black"/>
            <rect x="20" y="30" width="5" height="5" fill="black"/>
            <rect x="30" y="30" width="10" height="10" fill="black"/>
            <rect x="45" y="30" width="5" height="5" fill="black"/>
            <rect x="55" y="30" width="10" height="10" fill="black"/>
            <rect x="75" y="30" width="5" height="5" fill="black"/>
            <rect x="85" y="30" width="5" height="5" fill="black"/>
            <rect x="10" y="45" width="5" height="5" fill="black"/>
            <rect x="20" y="45" width="5" height="5" fill="black"/>
            <rect x="35" y="45" width="10" height="10" fill="black"/>
            <rect x="50" y="45" width="5" height="5" fill="black"/>
            <rect x="60" y="45" width="10" height="10" fill="black"/>
            <rect x="75" y="45" width="5" height="5" fill="black"/>
            <rect x="85" y="45" width="5" height="5" fill="black"/>
            <rect x="10" y="60" width="5" height="5" fill="black"/>
            <rect x="25" y="60" width="10" height="10" fill="black"/>
            <rect x="40" y="60" width="5" height="5" fill="black"/>
            <rect x="50" y="60" width="10" height="10" fill="black"/>
            <rect x="65" y="60" width="5" height="5" fill="black"/>
            <rect x="85" y="60" width="5" height="5" fill="black"/>
            <rect x="10" y="75" width="15" height="15" fill="black"/>
            <rect x="30" y="75" width="5" height="5" fill="black"/>
            <rect x="45" y="75" width="10" height="10" fill="black"/>
            <rect x="60" y="75" width="5" height="5" fill="black"/>
            <rect x="75" y="75" width="15" height="15" fill="black"/>
          </svg>
        </div>

        <div className="pass-key">
          <h3>Pass Key</h3>
          <div className="pass-key-value">{passKey}</div>
        </div>

        <div style={{ textAlign: 'left', background: '#f8fafb', padding: '2rem', borderRadius: '10px', marginTop: '2rem', border: '1px solid #dde2e8' }}>
          <p style={{ marginBottom: '0.75rem', color: '#2d3748', fontWeight: 500 }}>
            <strong style={{ color: '#1a365d' }}>Category:</strong> <span style={{ color: '#1a365d', fontWeight: 600 }}>{category}</span>
          </p>
          <p style={{ marginBottom: '0.75rem', color: '#2d3748', fontWeight: 500 }}>
            <strong style={{ color: '#1a365d' }}>Visitor Type:</strong> <span style={{ color: '#1a365d', fontWeight: 600 }}>{visitorType}</span>
          </p>
          {companyName && (
            <p style={{ marginBottom: '0.75rem', color: '#2d3748', fontWeight: 500 }}>
              <strong style={{ color: '#1a365d' }}>Company/Organization:</strong> <span style={{ color: '#1a365d', fontWeight: 600 }}>{companyName}</span>
            </p>
          )}
          {visitors && visitors.length > 0 && (
            <p style={{ marginBottom: '0.75rem', color: '#2d3748', fontWeight: 500 }}>
              <strong style={{ color: '#1a365d' }}>Number of Visitors:</strong> <span style={{ color: '#1a365d', fontWeight: 600 }}>{visitors.length}</span>
            </p>
          )}
          {purposeOfVisit && (
            <p style={{ marginBottom: '0.75rem', color: '#2d3748', fontWeight: 500 }}>
              <strong style={{ color: '#1a365d' }}>Purpose:</strong> <span style={{ color: '#1a365d', fontWeight: 600 }}>{purposeOfVisit}</span>
            </p>
          )}
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={handleNewVisitor}>
            Register New Visitor
          </button>
        </div>
      </div>
    </div>
  );
}
