import './Spinner.css';

function Spinner({ text = '' }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner-ring" />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}

export default Spinner;
