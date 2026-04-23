import './CandidateReasoning.css';

function CandidateReasoning({ name, score, reasoning }) {
  return (
    <div className="candidate-reasoning-card">
      <div className="candidate-reasoning-header">
        <span className="candidate-reasoning-name">{name}</span>
        <span className="candidate-reasoning-score">Score: {score}/100</span>
      </div>
      <p className="candidate-reasoning-text">{reasoning}</p>
    </div>
  );
}

export default CandidateReasoning;
