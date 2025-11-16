import { useLocation, useNavigate } from 'react-router-dom';
import { VisitorCategory } from '../types';

const visitorTypesByCategory: Record<VisitorCategory, string[]> = {
  Employee: ['Family'],
  Business: ['Client(India)', 'Client(Global)'],
  External: ['Vendor / Supplier', 'Third-Party Staff'],
  Compliance: ['Police', 'Auditor', 'Lawyer'],
  Logistics: ['Delivery / Courier'],
  Group: ['Sports'],
};

export default function VisitorTypePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state?.category as VisitorCategory;

  if (!category) {
    navigate('/category');
    return null;
  }

  const visitorTypes = visitorTypesByCategory[category];

  const handleVisitorTypeSelect = (visitorType: string) => {
    navigate('/visitor-form', { state: { category, visitorType } });
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Select Visitor Type</h2>
      <p className="page-subtitle" style={{ marginBottom: '1rem' }}>
        Category: <span className="category-badge">{category}</span>
      </p>
      <div className="visitor-type-grid">
        {visitorTypes.map((type) => (
          <button
            key={type}
            className="visitor-type-card"
            onClick={() => handleVisitorTypeSelect(type)}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}
