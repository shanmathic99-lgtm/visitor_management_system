import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { VisitorCategory, Visitor } from '../types';

export default function VisitorFormPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state?.category as VisitorCategory;
  const visitorType = location.state?.visitorType as string;

  const [visitors, setVisitors] = useState<Visitor[]>([{ name: '', age: '', gender: '', contact: '', relationship: '' }]);
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [companyContact, setCompanyContact] = useState('');
  // Third-Party Staff fields
  const [consultancyName, setConsultancyName] = useState('');
  const [yourName, setYourName] = useState('');
  const [deliveryManagerEmail, setDeliveryManagerEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [infyEmail, setInfyEmail] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [aadharDocument, setAadharDocument] = useState<File | null>(null);
  const [approvalMailScreenshot, setApprovalMailScreenshot] = useState<File | null>(null);

  if (!category || !visitorType) {
    navigate('/category');
    return null;
  }

  const addVisitor = () => {
    setVisitors([...visitors, { name: '', age: '', gender: '', contact: '', relationship: '' }]);
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

  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAadharDocument(e.target.files[0]);
    }
  };

  const handleApprovalMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApprovalMailScreenshot(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate visit date (and time for categories that need it)
      // Third-Party Staff only needs date, others need both date and time
      const needsTime = category !== 'External' || visitorType !== 'Third-Party Staff';
      const visitDateTime = needsTime && startDate && startTime 
        ? `${startDate} ${startTime}:00`
        : startDate;

      if (!startDate) {
        setError('Please select visit date.');
        setLoading(false);
        return;
      }

      if (needsTime && !startTime) {
        setError('Please select visit date and time.');
        setLoading(false);
        return;
      }

      // Get employee data from sessionStorage (needed for both Employee and External)
      const employeeDataStr = sessionStorage.getItem('employeeData');
      if (!employeeDataStr) {
        setError('Employee information not found. Please login again.');
        setLoading(false);
        return;
      }

      const employeeData = JSON.parse(employeeDataStr);
      // Use numeric id field, or parse emp_id string to number
      let empId: number;
      if (employeeData.id) {
        empId = typeof employeeData.id === 'string' ? parseInt(employeeData.id) : employeeData.id;
      } else if (employeeData.emp_id) {
        empId = parseInt(employeeData.emp_id);
      } else {
        setError('Employee ID not found. Please login again.');
        setLoading(false);
        return;
      }

      if (isNaN(empId)) {
        setError('Invalid Employee ID. Please login again.');
        setLoading(false);
        return;
      }

      // Call API for Employee category
      if (category === 'Employee') {
        // Map visitors to API format
        const visitorsData = visitors.map((visitor) => {
          const visitorObj: any = {
            visitor_name: visitor.name,
            visitor_gender: visitor.gender,
          };

          // Add relationship for Family visitor type
          if (visitorType === 'Family' && visitor.relationship) {
            visitorObj.visitor_relationship = visitor.relationship;
          }

          // Add metadata_json if purposeOfVisit exists (for non-Family types)
          if (visitorType !== 'Family' && purposeOfVisit) {
            visitorObj.metadata_json = {
              purpose: purposeOfVisit,
            };
          }

          return visitorObj;
        });

        // Prepare request body
        const requestBody = {
          category: 'employee',
          emp_id: empId,
          visit_date: visitDateTime,
          visitors: visitorsData,
        };

        // Call the API
        const response = await fetch('https://44wmv2jdqi.execute-api.ap-southeast-2.amazonaws.com/default/hk02', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }

        // Success - navigate to pass page with API response data
        navigate('/pass', {
          state: {
            category,
            visitorType,
            visitors,
            companyName,
            purposeOfVisit,
            apiResponse: data,
          },
        });
      } else if (category === 'External' && visitorType === 'Vendor / Supplier') {
        // Validate required fields for Vendor/Supplier
        if (!companyName || !companyAddress || !companyContact || !purposeOfVisit) {
          setError('Please fill in all required fields.');
          setLoading(false);
          return;
        }

        // Validate time is between 9am and 5pm
        const [hours, minutes] = startTime.split(':');
        const hour = parseInt(hours);
        const minute = parseInt(minutes || '0');
        const totalMinutes = hour * 60 + minute;
        const minMinutes = 9 * 60; // 9:00 AM
        const maxMinutes = 17 * 60; // 5:00 PM
        
        if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
          setError('Visit time must be between 9:00 AM and 5:00 PM');
          setLoading(false);
          return;
        }

        // Get current timestamp for requested_at
        const now = new Date();
        const requestedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        // Map visitors - all share same purpose and visit date
        const visitorsData = visitors.map((visitor) => {
          const visitorObj: any = {
            visitor_name: visitor.name,
            purpose_of_visit: purposeOfVisit,
            visit_date: visitDateTime,
          };

          // Add document URL if document is uploaded (for now, we'll skip this as it requires file upload handling)
          // if (document) {
          //   visitorObj.document = 'https://example.com/doc.pdf'; // This would need actual file upload implementation
          // }

          return visitorObj;
        });

        // Prepare request body for External Vendor/Supplier
        // category comes from the selected category (External)
        // sub_category comes from the selected visitor type (Vendor / Supplier)
        const requestBody = {
          emp_id: empId,
          category: category, // "External"
          sub_category: visitorType, // "Vendor / Supplier"
          requested_at: requestedAt,
          vendors: [
            {
              vendor_name: companyName,
              vendor_address: companyAddress,
              company_contact: companyContact,
              visitors: visitorsData,
            },
          ],
        };

        // Call the API
        const response = await fetch('https://jl7yevnyp9.execute-api.ap-southeast-2.amazonaws.com/default/hk03', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }

        // Success - navigate to pass page with API response data
        navigate('/pass', {
          state: {
            category,
            visitorType,
            visitors,
            companyName,
            purposeOfVisit,
            apiResponse: data,
          },
        });
      } else if (category === 'External' && visitorType === 'Third-Party Staff') {
        // Validate required fields for Third-Party Staff
        // Note: aadhar_card and approval_email are not sent to API for now
        if (!consultancyName || !yourName || !deliveryManagerEmail || !phoneNumber || !infyEmail || !buildingNumber || !startDate) {
          setError('Please fill in all required fields.');
          setLoading(false);
          return;
        }

        // Prepare request body for Third-Party Staff
        // Note: aadhar_card and approval_email fields are excluded for now
        const requestBody = {
          emp_id: empId,
          staff_name: yourName,
          consultancy_name: consultancyName,
          category: category, // "External"
          sub_category: visitorType, // "Third-Party Staff"
          delivery_manager_emailid: deliveryManagerEmail,
          phone_number: phoneNumber,
          infy_email: infyEmail,
          visit_date: startDate, // Only date, not datetime
          building_number: buildingNumber,
        };

        // Call the API
        const response = await fetch('https://lun94pxmtb.execute-api.ap-southeast-2.amazonaws.com/default/hk04', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }

        // Success - navigate to pass page with API response data
        navigate('/pass', {
          state: {
            category,
            visitorType,
            apiResponse: data,
          },
        });
      } else {
        // For other categories (Group), navigate without API call
        // (API integration will be added later)
        navigate('/pass', {
          state: {
            category,
            visitorType,
            visitors,
            companyName,
            purposeOfVisit,
            visitDate: visitDateTime,
          },
        });
      }
    } catch (err) {
      setError('Failed to submit visitor request. Please try again.');
      setLoading(false);
      console.error('API Error:', err);
    }
  };

  const renderEmployeeForm = () => {
    const isFamily = visitorType === 'Family';
    
    return (
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
                {!isFamily && (
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
                )}
                {isFamily && (
                  <div className="form-group">
                    <label className="form-label">Relationship</label>
                    <input
                      type="text"
                      className="form-input"
                      value={visitor.relationship || ''}
                      onChange={(e) => updateVisitor(index, 'relationship', e.target.value)}
                      placeholder="e.g., Spouse, Parent, Sibling"
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-secondary" onClick={addVisitor}>
          Add Visitor
        </button>
        {!isFamily && (
          <div className="form-group">
            <label className="form-label">Purpose of Visit</label>
            <textarea
              className="form-textarea"
              value={purposeOfVisit}
              onChange={(e) => setPurposeOfVisit(e.target.value)}
              required
            />
          </div>
        )}
        <div className="date-time-group">
          <div className="form-group">
            <label className="form-label">Visit Date</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Visit Time</label>
            <input
              type="time"
              className="form-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
        </div>
        {!isFamily && (
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
        )}
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
  };

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
          <label className="form-label">Visit Date</label>
          <input
            type="date"
            className="form-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Visit Time</label>
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

  const renderExternalForm = () => {
    const isThirdPartyStaff = visitorType === 'Third-Party Staff';
    
    // Validate time is between 9am and 5pm
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = e.target.value;
      if (time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const minute = parseInt(minutes || '0');
        const totalMinutes = hour * 60 + minute;
        const minMinutes = 9 * 60; // 9:00 AM
        const maxMinutes = 17 * 60; // 5:00 PM
        
        if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
          setError('Visit time must be between 9:00 AM and 5:00 PM');
          return;
        }
        setError('');
      }
      setStartTime(time);
    };

    // Render Third-Party Staff form
    if (isThirdPartyStaff) {
      return (
        <>
          <div className="form-group">
            <label className="form-label">Consultancy Name</label>
            <input
              type="text"
              className="form-input"
              value={consultancyName}
              onChange={(e) => setConsultancyName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              className="form-input"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Delivery Manager Email ID</label>
            <input
              type="email"
              className="form-input"
              value={deliveryManagerEmail}
              onChange={(e) => setDeliveryManagerEmail(e.target.value)}
              placeholder="manager@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Visit Date</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Infy Email</label>
            <input
              type="email"
              className="form-input"
              value={infyEmail}
              onChange={(e) => setInfyEmail(e.target.value)}
              placeholder="yourname@infosys.com"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Building Number</label>
            <input
              type="text"
              className="form-input"
              value={buildingNumber}
              onChange={(e) => setBuildingNumber(e.target.value)}
              placeholder="e.g., Building 1, Floor 2"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Upload Aadhar Card</label>
            <div className="file-upload">
              <input
                type="file"
                id="aadhar-upload"
                onChange={handleAadharChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label htmlFor="aadhar-upload" className="file-upload-label">
                {aadharDocument ? <span className="file-name">{aadharDocument.name}</span> : 'Click to upload Aadhar card'}
              </label>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Delivery Manager Approval Mail Screenshot</label>
            <div className="file-upload">
              <input
                type="file"
                id="approval-mail-upload"
                onChange={handleApprovalMailChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label htmlFor="approval-mail-upload" className="file-upload-label">
                {approvalMailScreenshot ? <span className="file-name">{approvalMailScreenshot.name}</span> : 'Click to upload approval mail screenshot'}
              </label>
            </div>
          </div>
        </>
      );
    }

    // Render Vendor/Supplier form
    return (
      <>
        <div className="form-group">
          <label className="form-label">Vendor Company Name</label>
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
        <div className="form-group">
          <label className="form-label">Company Contact</label>
          <input
            type="tel"
            className="form-input"
            value={companyContact}
            onChange={(e) => setCompanyContact(e.target.value)}
            placeholder="+1234567890"
            required
          />
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
            <label className="form-label">Visit Date</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Visit Time (9:00 AM - 5:00 PM)</label>
            <input
              type="time"
              className="form-input"
              value={startTime}
              onChange={handleTimeChange}
              min="09:00"
              max="17:00"
              required
            />
          </div>
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
  };

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
          <label className="form-label">Visit Date</label>
          <input
            type="date"
            className="form-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Visit Time</label>
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
          <label className="form-label">Visit Date</label>
          <input
            type="date"
            className="form-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Visit Time</label>
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
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <div className="button-group">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Submitting...' : 'Approve / Proceed'}
          </button>
        </div>
      </form>
    </div>
  );
}
