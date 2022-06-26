import React from 'react';

class Favorite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      restAddress: '',
      restName: '',
      addCommentId: null
    };
    this.prepSetToDelete = this.prepSetToDelete.bind(this);
    this.setAddCommentIdAddress = this.setAddCommentIdAddress.bind(this);
    this.createComment = this.createComment.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.addComment = this.addComment.bind(this);
  }

  prepSetToDelete(id, idTwo, idThree) {
    this.props.deleteThisBit(id, idTwo, idThree);
  }

  setAddCommentIdAddress(id, idTwo, idThree) {
    this.setState({ addCommentId: id });
    this.setState({ restAddress: idTwo });
    this.setState({ restName: idThree });
  }

  createComment() {
    this.setState({ comments: [...this.state.comments, ''] });
  }

  handleCommentChange(event, index) {
    const comments = [...this.state.comments];
    let comment = { ...comments[index] };
    comment = event.target.value;
    comments[index] = comment;
    this.setState({ comments });
    // console.log('this.state.comments:', this.state.comments);
  }

  addComment() {
    fetch(`/api/comments/${this.state.addCommentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comments: this.state.comments
      })
    })
      .then(res => res.json())
      .catch(err => console.error(err));
  }

  render() {
    // console.log('this.state.comments:', this.state.comments);
    // console.log('this.state.restName:', this.state.restName);
    // console.log('this.state.addCommentId:', this.state.addCommentId);
    return (
      <div className="container">
        <div className="modal fade" id={`addCommentModal-${this.props.propKey}`} tabIndex="-1" aria-labelledby="addCommentModalLabel" aria-hidden="true">
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
                <button type="button" onClick={event => this.createComment(event)} className="btn btn-secondary">Add comment</button>
                <button type="button" onClick={this.addComment} className="btn btn-primary" data-bs-dismiss="modal">Confirm</button>
              </div>
            </div>
          </div>
        </div>
        <div className="card mb-4">
          <div className="card-header">
            <h3>{this.props.restName}</h3>
          </div>
          <div className="card-body">
            <p className="card-text" >{this.props.restAddress}</p>
            <div className="row">
              <div className="d-flex justify-content-around">
                <button type="button" onClick={() => this.setAddCommentIdAddress(this.props.propKey, this.props.restAddress, this.props.restName)} className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#addCommentModal-${this.props.propKey}`}>Add Comment</button>
                <button type="button" className="btn btn-secondary">Edit Comment</button>
                <button type="button" className="btn btn-warning">Delete Comment</button>
                <button type="button" onClick={() => this.prepSetToDelete(this.props.propKey, this.props.restAddress, this.props.restName)} className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteLocationModal">Delete Location</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Favorite;
