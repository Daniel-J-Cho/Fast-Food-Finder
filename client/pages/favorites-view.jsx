import React from 'react';
import HomeButton from '../components/home-button';
import Favorite from '../components/favorite';

class FavoritesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      toDeleteId: null,
      restName: '',
      restAddress: '',
      addCommentId: null
    };
    this.setToDelete = this.setToDelete.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.setAddCommentIdAddress = this.setAddCommentIdAddress.bind(this);
    // this.createComment = this.createComment.bind(this);
    // this.handleCommentChange = this.handleCommentChange.bind(this);
    this.addComment = this.addComment.bind(this);
  }

  componentDidMount() {
    fetch('/api/restLocs')
      .then(res => res.json())
      .then(data => this.setState({ entries: data }))
      .catch(err => console.error('error:', err));
  }

  setToDelete(id, idTwo, idThree) {
    this.setState({ toDeleteId: id });
    this.setState({ restAddress: idTwo });
    this.setState({ restName: idThree });
  }

  setAddCommentIdAddress(id, idTwo, idThree) {
    this.setState({ addCommentId: id });
    this.setState({ restAddress: idTwo });
    this.setState({ restName: idThree });
  }

  // createComment() {
  //   this.setState({ comments: [...this.state.comments, ''] });
  // }

  // handleCommentChange(event, index) {
  //   const comments = [...this.state.comments];
  //   let comment = { ...comments[index] };
  //   comment = event.target.value;
  //   comments[index] = comment;
  //   this.setState({ comments });
  //   console.log('this.state.comments:', this.state.comments);
  // }

  addComment(event) {
    fetch(`/api/comments/${this.state.addCommentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .catch(err => console.error(err));
  }

  deleteEntry(event) {
    fetch(`/api/favorites/${this.state.toDeleteId}`, {
      method: 'DELETE'
    })
      .then(() => {
        const filteredEntries = this.state.entries.filter(entry => {
          return entry.locationId !== this.state.toDeleteId;
        });
        this.setState({ entries: filteredEntries, toDeleteId: null });
      })
      .catch(err => console.error(err));
  }

  render() {
    // console.log('this.state.entries:', this.state.entries);
    // console.log('this.state.toDeleteId:', this.state.toDeleteId);
    // console.log('this.state.addCommentId:', this.state.addCommentId);
    return (
      <div className="container">
        {/* <div className="modal fade" id="addCommentModal" tabIndex="-1" aria-labelledby="addCommentModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addCommentModalLabel">Add a comment to this {this.state.restName} entry</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
              </div>
              <div className="modal-body">
                <p><b>Address:</b> {this.state.restAddress}</p>
                <div className="comments">
                  {this.state.comments.map((comment, index) => {
                    return <div key={index}><input value={comment} onChange={event => this.handleCommentChange(event, index)} /><br></br><br></br></div>;
                  })}
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-evenly">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                <button type="button" onClick={event => this.createComment(event)} className="btn btn-secondary">Add another comment</button>
                <button type="button" onClick={event => this.addComment(event)} className="btn btn-primary" data-bs-dismiss="modal">Confirm</button>
              </div>
            </div>
          </div>
        </div> */}
        <div className="modal fade" id="deleteLocationModal" tabIndex="-1" aria-labelledby="delLocModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="delLocModalLabel">Delete {this.state.restName} Favorite</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this entry located at <b>{this.state.restAddress}</b>?</p>
              </div>
              <div className="modal-footer d-flex justify-content-evenly">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                <button type="button" onClick={event => this.deleteEntry(event)} className="btn btn-danger" data-bs-dismiss="modal">Delete</button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="home-button d-flex align-items-center">
            <HomeButton />
          </div>
        </div>
        <div className="row mt-4">
          {this.state.entries.map(entry => {
            return (
              <Favorite
                key={entry.locationId} propKey={entry.locationId} restName={entry.restaurantName} restAddress={entry.address}
                deleteThisBit={this.setToDelete} addThisBit={this.setAddCommentIdAddress}
              />
              // <div className="card mb-4" key={entry.locationId}>
              //   <div className="card-header">
              //     <h3>{entry.restaurantName}</h3>
              //   </div>
              //   <div className="card-body">
              //     <p className="card-text" >{entry.address}</p>
              //     <div className="row">
              //       <div className="d-flex justify-content-around">
              //         <button type="button" onClick={() => this.setAddCommentIdAddress(entry.locationId, entry.address, entry.restaurantName)} className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addCommentModal">Add Comment</button>
              //         <button type="button" className="btn btn-secondary">Edit Comment</button>
              //         <button type="button" className="btn btn-warning">Delete Comment</button>
              //         <button type="button" onClick={() => this.setToDelete(entry.locationId, entry.address, entry.restaurantName)} className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteLocationModal">Delete Location</button>
              //       </div>
              //     </div>
              //   </div>
              // </div>
            );
          })};
        </div>
      </div>
    );
  }
}

export default FavoritesView;
