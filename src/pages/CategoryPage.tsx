import { useState } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState<VisitorCategory | ''>('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
      navigate('/visitor-type', { state: { category: selectedCategory } });
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Select Visitor Category</h2>
      <form onSubmit={handleNext}>
        <div className="form-group">
          <label className="form-label" htmlFor="category">
            Visitor Category
          </label>
          <select
            id="category"
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as VisitorCategory)}
            required
          >
            <option value="">Choose a category...</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
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
