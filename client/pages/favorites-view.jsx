import React from 'react';
import HomeButton from '../components/home-button';
import EntryBox from '../components/entry-box';

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
        <div>
          <EntryBox />
        </div>
      </div>
    );
  }
}

export default FavoritesView;
