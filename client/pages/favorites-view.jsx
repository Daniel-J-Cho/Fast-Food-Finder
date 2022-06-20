import React from 'react';
import HomeButton from '../components/home-button';

class FavoritesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: []
    };
  }

  componentDidMount() {
    fetch('/api/restLocs')
      .then(res => res.json())
      .then(data => this.setState({ entries: data }))
      .catch(err => console.error('error:', err));
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="home-button d-flex align-items-center">
            <HomeButton />
          </div>
        </div>
        <div className="row mt-4">
          {this.state.entries.map(entry => {
            return <div className="card mb-4" key={entry.locationId}>
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
                    <button type="button" className="btn btn-danger">Delete Location</button>
                  </div>
                </div>
              </div>
            </div>;
          })}
        </div>
      </div>
    );
  }
}

export default FavoritesView;
