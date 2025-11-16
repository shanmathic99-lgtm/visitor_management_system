import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { VisitorCategory, Visitor } from '../types';

export default function VisitorFormPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state?.category as VisitorCategory;
  const visitorType = location.state?.visitorType as string;

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [currentVisitorName, setCurrentVisitorName] = useState('');
  const [currentExternalVisitorName, setCurrentExternalVisitorName] = useState('');
  const [currentComplianceVisitorName, setCurrentComplianceVisitorName] = useState('');
  const [currentGroupVisitorName, setCurrentGroupVisitorName] = useState('');
  
  // Initialize visitors based on category
  useEffect(() => {
    if (category === 'Employee') {
      setVisitors([{ name: '', age: '', gender: '', contact: '' }]);
    } else if (category === 'Business') {
      setVisitors([]);
    } else if (category === 'External' || category === 'Compliance') {
      setVisitors([]);
    } else if (category === 'Group') {
      // Group form needs at least one visitor for contact field
      setVisitors([{ name: '', age: '', gender: '', contact: '' }]);
    } else {
      setVisitors([{ name: '', age: '', gender: '', contact: '' }]);
    }
  }, [category]);
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [country, setCountry] = useState('');
  const [purposeOfVisit, setPurposeOfVisit] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [teamCaptain, setTeamCaptain] = useState('');
  const [sportsType, setSportsType] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [document, setDocument] = useState<File | null>(null);

  if (!category || !visitorType) {
    navigate('/category');
    return null;
  }

  const addVisitor = () => {
    setVisitors([...visitors, { name: '', age: '', gender: '', contact: '' }]);
  };

  const addBusinessVisitor = () => {
    if (currentVisitorName.trim()) {
      setVisitors([...visitors, { name: currentVisitorName.trim(), age: '', gender: '', contact: '' }]);
      setCurrentVisitorName('');
    }
  };

  const addVisitorByName = (name: string) => {
    if (name.trim()) {
      setVisitors([...visitors, { name: name.trim(), age: '', gender: '', contact: '' }]);
      return true;
    }
    return false;
  };

  const removeBusinessVisitor = (index: number) => {
    const updatedVisitors = visitors.filter((_, i) => i !== index);
    setVisitors(updatedVisitors);
  };

  const removeVisitor = (index: number) => {
    const updatedVisitors = visitors.filter((_, i) => i !== index);
    setVisitors(updatedVisitors);
  };

  // Helper function to render visitor list
  const renderVisitorList = (listLabel: string = 'Added Visitors') => {
    if (visitors.length === 0 || !visitors.some(v => v.name.trim())) {
      return null;
    }

    return (
      <div style={{ marginTop: '1.5rem' }}>
        <h4 style={{ 
          fontSize: '1rem', 
          fontWeight: 600, 
          marginBottom: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#64748b'
        }}>
          {listLabel} ({visitors.filter(v => v.name.trim()).length})
        </h4>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.75rem',
          maxHeight: '300px',
          overflowY: 'auto',
          paddingRight: '0.5rem'
        }}>
          {visitors
            .map((visitor, index) => ({ visitor, index }))
            .filter(({ visitor }) => visitor.name.trim())
            .map(({ visitor, index }) => (
              <div
                key={index}
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e0';
                  e.currentTarget.style.background = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = '#f8fafc';
                }}
              >
                <span style={{ 
                  color: '#0f172a', 
                  fontWeight: 500,
                  fontSize: '0.9375rem'
                }}>
                  {visitor.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeVisitor(index)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#dc2626',
                    cursor: 'pointer',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fee2e2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const updateVisitor = (index: number, field: keyof Visitor, value: string) => {
    const updatedVisitors = [...visitors];
    updatedVisitors[index] = { ...updatedVisitors[index], [field]: value };
    setVisitors(updatedVisitors);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure at least one visitor is added for forms that require visitors
    const requiresVisitors = ['Business', 'External', 'Compliance', 'Group'];
    if (requiresVisitors.includes(category) && !visitors.some(v => v.name.trim())) {
      const visitorType = category === 'Compliance' ? 'person' : category === 'Group' ? 'player' : 'visitor';
      alert(`Please add at least one ${visitorType}`);
      return;
    }
    
    // For Group form, ensure contact is filled
    if (category === 'Group' && visitors[0] && !visitors[0].contact.trim()) {
      alert('Please enter contact details');
      return;
    }
    
    navigate('/pass', {
      state: {
        category,
        visitorType,
        visitors: requiresVisitors.includes(category)
          ? visitors.filter(v => v.name.trim())
          : visitors,
        companyName,
        purposeOfVisit,
      },
    });
  };

  const renderEmployeeForm = () => (
    <>
      <div className="visitors-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
            Visitor Information
          </h3>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={addVisitor}
            style={{ fontSize: '0.875rem', padding: '0.625rem 1.25rem' }}
          >
            + Add Visitor
          </button>
        </div>
        <div className="visitors-list">
          {visitors.map((visitor, index) => (
            <div key={index} className="visitor-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h4>Visitor {index + 1}</h4>
                {visitors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updatedVisitors = visitors.filter((_, i) => i !== index);
                      setVisitors(updatedVisitors);
                    }}
                    style={{
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      padding: '0.375rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fecaca';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fee2e2';
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="visitor-fields">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={visitor.name}
                    onChange={(e) => updateVisitor(index, 'name', e.target.value)}
                    placeholder="Enter visitor name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-input"
                    value={visitor.age}
                    onChange={(e) => updateVisitor(index, 'age', e.target.value)}
                    placeholder="Enter age"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    value={visitor.gender}
                    onChange={(e) => updateVisitor(index, 'gender', e.target.value)}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Details</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={visitor.contact}
                    onChange={(e) => updateVisitor(index, 'contact', e.target.value)}
                    placeholder="Enter contact number"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {visitors.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            background: '#f8fafc', 
            borderRadius: '12px', 
            border: '2px dashed #cbd5e0',
            color: '#64748b'
          }}>
            <p style={{ marginBottom: '1rem', fontSize: '0.9375rem' }}>No visitors added yet</p>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={addVisitor}
            >
              + Add First Visitor
            </button>
          </div>
        )}
        {visitors.length > 0 && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={addVisitor}
            >
              + Add Another Visitor
            </button>
          </div>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">Purpose of Visit</label>
        <textarea
          className="form-textarea"
          value={purposeOfVisit}
          onChange={(e) => setPurposeOfVisit(e.target.value)}
          required
        />
      </div>
      <div className="date-time-group">
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Start Time</label>
          <input
            type="time"
            className="form-input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="date-time-group">
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">End Time</label>
          <input
            type="time"
            className="form-input"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Upload Adhaar Reference Document</label>
        <div className="file-upload">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <label htmlFor="file-upload" className="file-upload-label">
            {document ? <span className="file-name">{document.name}</span> : 'Click to upload document'}
          </label>
        </div>
      </div>
    </>
  );

  const renderBusinessForm = () => (
    <>
      <div className="form-group">
        <label className="form-label">Client Company Name</label>
        <input
          type="text"
          className="form-input"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Company Address</label>
        <textarea
          className="form-textarea"
          value={companyAddress}
          onChange={(e) => setCompanyAddress(e.target.value)}
          required
        />
      </div>
      {visitorType === 'Client(Global)' && (
        <div className="form-group">
          <label className="form-label">Country</label>
          <input
            type="text"
            className="form-input"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
      )}
      <div className="visitors-section">
        <div className="form-group">
          <label className="form-label">Visitor Name</label>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                className="form-input"
                value={currentVisitorName}
                onChange={(e) => setCurrentVisitorName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addBusinessVisitor();
                  }
                }}
                placeholder="Enter visitor name"
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={addBusinessVisitor}
              disabled={!currentVisitorName.trim()}
              style={{ 
                padding: '0.875rem 1.5rem',
                whiteSpace: 'nowrap',
                opacity: currentVisitorName.trim() ? 1 : 0.6,
                cursor: currentVisitorName.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Add
            </button>
          </div>
        </div>
        {renderVisitorList('Added Visitors')}
      </div>
      <div className="form-group">
        <label className="form-label">Purpose of Visit</label>
        <textarea
          className="form-textarea"
          value={purposeOfVisit}
          onChange={(e) => setPurposeOfVisit(e.target.value)}
          required
        />
      </div>
      <div className="date-time-group">
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Start Time</label>
          <input
            type="time"
            className="form-input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="date-time-group">
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">End Time</label>
          <input
            type="time"
            className="form-input"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Upload Email/Client Request</label>
        <div className="file-upload">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png,.eml,.msg"
          />
          <label htmlFor="file-upload" className="file-upload-label">
            {document ? <span className="file-name">{document.name}</span> : 'Click to upload document'}
          </label>
        </div>
      </div>
    </>
  );

  const renderExternalForm = () => (
    <>
      <div className="form-group">
        <label className="form-label">
          {visitorType === 'Vendor / Supplier' ? 'Vendor Company Name' : 'Company Name'}
        </label>
        <input
          type="text"
          className="form-input"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Company Address</label>
        <textarea
          className="form-textarea"
          value={companyAddress}
          onChange={(e) => setCompanyAddress(e.target.value)}
          required
        />
      </div>
      <div className="visitors-section">
        <div className="form-group">
          <label className="form-label">Visitor Name</label>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                className="form-input"
                value={currentExternalVisitorName}
                onChange={(e) => setCurrentExternalVisitorName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (addVisitorByName(currentExternalVisitorName)) {
                      setCurrentExternalVisitorName('');
                    }
                  }
                }}
                placeholder="Enter visitor name"
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (addVisitorByName(currentExternalVisitorName)) {
                  setCurrentExternalVisitorName('');
                }
              }}
              disabled={!currentExternalVisitorName.trim()}
              style={{ 
                padding: '0.875rem 1.5rem',
                whiteSpace: 'nowrap',
                opacity: currentExternalVisitorName.trim() ? 1 : 0.6,
                cursor: currentExternalVisitorName.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Add
            </button>
          </div>
        </div>
        {renderVisitorList('Added Visitors')}
      </div>
      <div className="form-group">
        <label className="form-label">Purpose of Visit</label>
        <textarea
          className="form-textarea"
          value={purposeOfVisit}
          onChange={(e) => setPurposeOfVisit(e.target.value)}
          required
        />
      </div>
      <div className="date-time-group">
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Start Time</label>
          <input
            type="time"
            className="form-input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="date-time-group">
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">End Time</label>
          <input
            type="time"
            className="form-input"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Upload Document</label>
        <div className="file-upload">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <label htmlFor="file-upload" className="file-upload-label">
            {document ? <span className="file-name">{document.name}</span> : 'Click to upload document'}
          </label>
        </div>
      </div>
    </>
  );

  const renderComplianceForm = () => (
    <>
      <div className="visitors-section">
        <div className="form-group">
          <label className="form-label">Person Name</label>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                className="form-input"
                value={currentComplianceVisitorName}
                onChange={(e) => setCurrentComplianceVisitorName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (addVisitorByName(currentComplianceVisitorName)) {
                      setCurrentComplianceVisitorName('');
                    }
                  }
                }}
                placeholder="Enter person name"
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (addVisitorByName(currentComplianceVisitorName)) {
                  setCurrentComplianceVisitorName('');
                }
              }}
              disabled={!currentComplianceVisitorName.trim()}
              style={{ 
                padding: '0.875rem 1.5rem',
                whiteSpace: 'nowrap',
                opacity: currentComplianceVisitorName.trim() ? 1 : 0.6,
                cursor: currentComplianceVisitorName.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Add
            </button>
          </div>
        </div>
        {renderVisitorList('Added Persons')}
      </div>
      <div className="form-group">
        <label className="form-label">Purpose of Visit</label>
        <textarea
          className="form-textarea"
          value={purposeOfVisit}
          onChange={(e) => setPurposeOfVisit(e.target.value)}
          required
        />
      </div>
      <div className="date-time-group">
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Start Time</label>
          <input
            type="time"
            className="form-input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="date-time-group">
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">End Time</label>
          <input
            type="time"
            className="form-input"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Upload Document</label>
        <div className="file-upload">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <label htmlFor="file-upload" className="file-upload-label">
            {document ? <span className="file-name">{document.name}</span> : 'Click to upload document'}
          </label>
        </div>
      </div>
    </>
  );

  const renderLogisticsForm = () => (
    <>
      <div className="form-group">
        <label className="form-label">Name of Delivery Partner</label>
        <input
          type="text"
          className="form-input"
          value={visitors[0].name}
          onChange={(e) => updateVisitor(0, 'name', e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Contact Number</label>
        <input
          type="tel"
          className="form-input"
          value={visitors[0].contact}
          onChange={(e) => updateVisitor(0, 'contact', e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">List of Deliverables</label>
        <textarea
          className="form-textarea"
          value={deliverables}
          onChange={(e) => setDeliverables(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Delivery Date</label>
        <input
          type="date"
          className="form-input"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Upload Document</label>
        <div className="file-upload">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <label htmlFor="file-upload" className="file-upload-label">
            {document ? <span className="file-name">{document.name}</span> : 'Click to upload document'}
          </label>
        </div>
      </div>
    </>
  );

  const renderGroupForm = () => (
    <>
      <div className="form-group">
        <label className="form-label">Name of Organization</label>
        <input
          type="text"
          className="form-input"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Team Captain</label>
        <input
          type="text"
          className="form-input"
          value={teamCaptain}
          onChange={(e) => setTeamCaptain(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Contact Details</label>
        <input
          type="tel"
          className="form-input"
          value={visitors[0].contact}
          onChange={(e) => updateVisitor(0, 'contact', e.target.value)}
          required
        />
      </div>
      <div className="visitors-section">
        <div className="form-group">
          <label className="form-label">Player Name</label>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                className="form-input"
                value={currentGroupVisitorName}
                onChange={(e) => setCurrentGroupVisitorName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (addVisitorByName(currentGroupVisitorName)) {
                      setCurrentGroupVisitorName('');
                    }
                  }
                }}
                placeholder="Enter player name"
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (addVisitorByName(currentGroupVisitorName)) {
                  setCurrentGroupVisitorName('');
                }
              }}
              disabled={!currentGroupVisitorName.trim()}
              style={{ 
                padding: '0.875rem 1.5rem',
                whiteSpace: 'nowrap',
                opacity: currentGroupVisitorName.trim() ? 1 : 0.6,
                cursor: currentGroupVisitorName.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Add
            </button>
          </div>
        </div>
        {renderVisitorList('Added Players')}
      </div>
      <div className="form-group">
        <label className="form-label">Sports Type</label>
        <input
          type="text"
          className="form-input"
          value={sportsType}
          onChange={(e) => setSportsType(e.target.value)}
          required
        />
      </div>
      <div className="date-time-group">
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Start Time</label>
          <input
            type="time"
            className="form-input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="date-time-group">
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">End Time</label>
          <input
            type="time"
            className="form-input"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Upload Document</label>
        <div className="file-upload">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <label htmlFor="file-upload" className="file-upload-label">
            {document ? <span className="file-name">{document.name}</span> : 'Click to upload document'}
          </label>
        </div>
      </div>
    </>
  );

  const renderForm = () => {
    switch (category) {
      case 'Employee':
        return renderEmployeeForm();
      case 'Business':
        return renderBusinessForm();
      case 'External':
        return renderExternalForm();
      case 'Compliance':
        return renderComplianceForm();
      case 'Logistics':
        return renderLogisticsForm();
      case 'Group':
        return renderGroupForm();
      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Visitor Information</h2>
      <p className="page-subtitle">
        <span className="category-badge">{category}</span> - <span style={{ color: '#64748b', fontWeight: 500 }}>{visitorType}</span>
      </p>
      <form onSubmit={handleSubmit}>
        {renderForm()}
        <div className="button-group">
          <button type="submit" className="btn btn-success">
            Approve / Proceed
          </button>
        </div>
      </form>
    </div>
  );
}
