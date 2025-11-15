import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { VisitorCategory, Visitor } from '../types';

export default function VisitorFormPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state?.category as VisitorCategory;
  const visitorType = location.state?.visitorType as string;

  const [visitors, setVisitors] = useState<Visitor[]>([{ name: '', age: '', gender: '', contact: '' }]);
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
    navigate('/pass', {
      state: {
        category,
        visitorType,
        visitors,
        companyName,
        purposeOfVisit,
      },
    });
  };

  const renderEmployeeForm = () => (
    <>
      <div className="visitors-list">
        {visitors.map((visitor, index) => (
          <div key={index} className="visitor-card">
            <h4>Visitor {index + 1}</h4>
            <div className="visitor-fields">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={visitor.name}
                  onChange={(e) => updateVisitor(index, 'name', e.target.value)}
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
                  <option value="">Select</option>
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
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-secondary" onClick={addVisitor}>
        Add Visitor
      </button>
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
      <div className="visitors-list">
        {visitors.map((visitor, index) => (
          <div key={index} className="visitor-card">
            <h4>Visitor {index + 1}</h4>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                value={visitor.name}
                onChange={(e) => updateVisitor(index, 'name', e.target.value)}
                required
              />
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-secondary" onClick={addVisitor}>
        Add Visitor
      </button>
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
      <div className="visitors-list">
        {visitors.map((visitor, index) => (
          <div key={index} className="visitor-card">
            <h4>Visitor {index + 1}</h4>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                value={visitor.name}
                onChange={(e) => updateVisitor(index, 'name', e.target.value)}
                required
              />
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-secondary" onClick={addVisitor}>
        Add Visitor
      </button>
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
      <div className="visitors-list">
        {visitors.map((visitor, index) => (
          <div key={index} className="visitor-card">
            <h4>Person {index + 1}</h4>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                value={visitor.name}
                onChange={(e) => updateVisitor(index, 'name', e.target.value)}
                required
              />
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-secondary" onClick={addVisitor}>
        Add Person
      </button>
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
      <div className="visitors-list">
        {visitors.map((visitor, index) => (
          <div key={index} className="visitor-card">
            <h4>Player {index + 1}</h4>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                value={visitor.name}
                onChange={(e) => updateVisitor(index, 'name', e.target.value)}
                required
              />
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-secondary" onClick={addVisitor}>
        Add Player
      </button>
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
      <p style={{ textAlign: 'center', color: '#718096', marginBottom: '2rem' }}>
        <strong>{category}</strong> - {visitorType}
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
