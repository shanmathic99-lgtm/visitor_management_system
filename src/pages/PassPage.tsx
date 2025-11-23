import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';

export default function PassPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [passKey, setPassKey] = useState('');

  useEffect(() => {
    const generatedKey = Math.random().toString(36).substring(2, 12).toUpperCase();
    setPassKey(generatedKey);
  }, []);

  const { category, visitorType, visitors, companyName, purposeOfVisit, apiResponse } = location.state || {};

  if (!category) {
    navigate('/');
    return null;
  }

  const handleNewVisitor = () => {
    navigate('/');
  };

  // Generate QR code data with category, sub_category, id, emp_id
  const getQRCodeData = () => {
    if (apiResponse) {
      const qrData = {
        category: category,
        sub_category: visitorType,
        id: apiResponse.id || apiResponse.request_id,
        emp_id: apiResponse.emp_id,
      };
      return JSON.stringify(qrData);
    }
    // Fallback if no API response
    return JSON.stringify({
      category: category,
      sub_category: visitorType,
      passKey: passKey,
    });
  };

  const qrCodeData = getQRCodeData();

  return (
    <div className="page-container">
      <div className="qr-pass-container">
        <h2 className="page-title">Visitor Pass Generated Successfully</h2>

        <div className="qr-code" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <QRCode 
            value={qrCodeData} 
            size={200} 
            level="H"
            includeMargin={true}
          />
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
            <strong style={{ color: '#1a365d' }}>Sub Category:</strong> <span style={{ color: '#1a365d', fontWeight: 600 }}>{visitorType}</span>
          </p>
          {apiResponse && (
            <>
              {apiResponse.id && (
                <p style={{ marginBottom: '0.75rem', color: '#2d3748', fontWeight: 500 }}>
                  <strong style={{ color: '#1a365d' }}>ID:</strong> <span style={{ color: '#1a365d', fontWeight: 600 }}>{apiResponse.id}</span>
                </p>
              )}
              {apiResponse.request_id && (
                <p style={{ marginBottom: '0.75rem', color: '#2d3748', fontWeight: 500 }}>
                  <strong style={{ color: '#1a365d' }}>Request ID:</strong> <span style={{ color: '#1a365d', fontWeight: 600 }}>{apiResponse.request_id}</span>
                </p>
              )}
              {apiResponse.emp_id && (
                <p style={{ marginBottom: '0.75rem', color: '#2d3748', fontWeight: 500 }}>
                  <strong style={{ color: '#1a365d' }}>Employee ID:</strong> <span style={{ color: '#1a365d', fontWeight: 600 }}>{apiResponse.emp_id}</span>
                </p>
              )}
              {apiResponse.approval_status && (
                <p style={{ marginBottom: '0.75rem', color: '#2d3748', fontWeight: 500 }}>
                  <strong style={{ color: '#1a365d' }}>Approval Status:</strong> <span style={{ color: '#1a365d', fontWeight: 600 }}>{apiResponse.approval_status}</span>
                </p>
              )}
            </>
          )}
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
