import React from 'react';

function Spinner(props) {
  if (props.spinner === false) {
    return null;
  }

  return (
    <div className="spinner-border text-danger" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Spinner;
