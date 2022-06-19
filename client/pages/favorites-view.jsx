import React from 'react';
import HomeButton from '../components/home-button';

class FavoritesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: []
    };
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
          {this.props.createCards}
        </div>
      </div>
    );
  }
}

export default FavoritesView;
