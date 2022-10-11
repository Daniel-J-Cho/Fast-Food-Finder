import React from 'react';
import HomeButton from '../components/home-button';
import Favorite from '../components/favorite';
import FastFoodFinder from '../components/fast-food-finder';
import RegisterButton from '../components/register-button';

class FavoritesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      toDeleteId: null,
      restName: '',
      restAddress: ''
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

  setToDelete(id, idTwo, idThree) {
    this.setState({ toDeleteId: id, restAddress: idTwo, restName: idThree });
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
        <div className="row sign-in-register-row">
          <div className="mt-3 d-flex justify-content-end ">
            <RegisterButton />
          </div>
        </div>
        <div className="row main-header-row">
          <div className="main-header justify-content-center">
            <FastFoodFinder />
          </div>
        </div>
        <div className="row home-fav-row">
          <div className="home-button d-flex align-items-center">
            <HomeButton />
          </div>
        </div>
        <div className="row map-row mt-4">
          {this.state.entries.map(entry => {
            return (
              <Favorite
                key={entry.locationId} propKey={entry.locationId} restName={entry.restaurantName} restAddress={entry.address}
                deleteThisBit={this.setToDelete}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default FavoritesView;
