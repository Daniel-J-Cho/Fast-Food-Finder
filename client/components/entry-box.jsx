import React from 'react';

function EntryBox(props) {
  // console.log('props.restAddress:', props.restAddress);
  // console.log('props.restName:', props.restName);
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{props.restName}</h5>
        <p className="card-text">{props.restAddress}</p>
        <p className="card-text">make this a bullet-pointed comment</p>
        <div className="row">
          <div className="d-flex justify-content-around">
            <button type="button" className="btn btn-primary">Add Comment</button>
            <button type="button" className="btn btn-secondary">Edit Comment</button>
            <button type="button" className="btn btn-warning">Delete Comment</button>
            <button type="button" className="btn btn-danger">Delete Location</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntryBox;
