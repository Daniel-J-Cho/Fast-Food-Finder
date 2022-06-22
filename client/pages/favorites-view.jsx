import React from 'react';
import HomeButton from '../components/home-button';

class FavoritesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      toDeleteId: null
    };
    this.setToDelete = this.setToDelete.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
  }

  componentDidMount() {
    fetch('/api/restLocs')
      .then(res => res.json())
      .then(data => this.setState({ entries: data }))
      .catch(err => console.error('error:', err));
  }

  setToDelete(id) {
    this.setState({ toDeleteId: id });
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

    return (
      <div className="container">
        <div className="modal fade" id="deleteLocationModal" tabIndex="-1" aria-labelledby="delLocModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="delLocModalLabel">Delete?</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this location?</p>
              </div>
              <div className="modal-footer d-flex justify-content-evenly">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={event => this.deleteEntry(event)}>Delete</button>
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
              <div className="card mb-4" key={entry.locationId}>
                <div className="card-header">
                  <h3>{entry.restaurantName}</h3>
                </div>
                <div className="card-body">
                  <p className="card-text" >{entry.address}</p>
                  <div className="row">
                    <div className="d-flex justify-content-around">
                      <button type="button" className="btn btn-primary">Add Comment</button>
                      <button type="button" className="btn btn-secondary">Edit Comment</button>
                      <button type="button" className="btn btn-warning">Delete Comment</button>
                      <button type="button" onClick={() => this.setToDelete(entry.locationId)} className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteLocationModal">Delete Location</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })};
        </div>
      </div>
    );
  }
}

export default FavoritesView;
