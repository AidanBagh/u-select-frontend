import { useState } from 'react';
import './JobForm.css';

const EMPTY = {
  title: '',
  description: '',
  requirements: '',
  weights: { skills: 40, experience: 30, education: 20, relevance: 10 },
};

function JobForm({ initialData, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(
    initialData
      ? { ...initialData, requirements: initialData.requirements.join(', ') }
      : EMPTY
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('weight-')) {
      const key = name.replace('weight-', '');
      setForm((f) => ({ ...f, weights: { ...f.weights, [key]: Number(value) } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      requirements: form.requirements.split(',').map((r) => r.trim()).filter(Boolean),
    });
  };

  return (
    <form className="jobform-container" onSubmit={handleSubmit}>
      <div className="jobform-group">
        <label className="jobform-label">Title</label>
        <input
          className="jobform-input"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="jobform-group">
        <label className="jobform-label">Description</label>
        <textarea
          className="jobform-textarea"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
        />
      </div>

      <div className="jobform-group">
        <label className="jobform-label">Requirements (comma-separated)</label>
        <input
          className="jobform-input"
          name="requirements"
          value={form.requirements}
          onChange={handleChange}
          placeholder="e.g. React, Node.js, 3 years experience"
        />
      </div>

      <div className="jobform-weights">
        <p className="jobform-weights-title">Scoring Weights</p>
        <p className="jobform-weights-hint">Set how much each category counts when the AI scores candidates. All values should add up to 100.</p>
        {['skills', 'experience', 'education', 'relevance'].map((key) => (
          <div className="jobform-weight-row" key={key}>
            <label className="jobform-weight-label">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              className="jobform-weight-input"
              type="number"
              name={`weight-${key}`}
              value={form.weights[key]}
              onChange={handleChange}
              min={0}
              max={100}
            />
          </div>
        ))}
      </div>

      <div className="jobform-actions">
        <button className="jobform-submit" type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Save'}
        </button>
        {onCancel && (
          <button className="jobform-cancel" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default JobForm;
