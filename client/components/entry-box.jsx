import React from 'react';

function EntryBox(props) {
  return (
    <div className="card">
      <img src="/images/200.gif" className="card-img-top" alt="..."></img>
      <div className="card-body">
        <h5 className="card-title">Franchise name goes here</h5>
        <p className="card-text">Address goes here</p>
        <p className="card-text">make this a bullet-pointed comment</p>
        <button type="button" className="btn btn-primary">Add Comment</button>
        <button type="button" className="btn btn-secondary">Edit Comment</button>
        <button type="button" className="btn btn-warning">Delete Comment</button>
        <button type="button" className="btn btn-danger">Delete Location</button>
      </div>
    </div>
  );
}

export default EntryBox;
