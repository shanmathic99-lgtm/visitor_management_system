import { useNavigate } from 'react-router-dom';
import { VisitorCategory } from '../types';

const categories: VisitorCategory[] = [
  'Employee',
  'Business',
  'External',
  'Compliance',
  'Logistics',
  'Group',
];

export default function CategoryPage() {
  const navigate = useNavigate();

  const handleCategorySelect = (category: VisitorCategory) => {
    navigate('/visitor-type', { state: { category } });
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Select Visitor Category</h2>
      <div className="category-grid">
        {categories.map((category) => (
          <button
            key={category}
            className="category-card"
            onClick={() => handleCategorySelect(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
