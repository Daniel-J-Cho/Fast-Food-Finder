import React from 'react';
import HomeButton from '../components/home-button';
import FavoritesButton from '../components/favorites-button';
import FastFoodFinder from '../components/fast-food-finder';

class RegisterView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      freshUsername: '',
      freshPassword: ''
    };
  }

  render() {
    return (
      <div className="container">
        <div className="row main-header-row">
          <div className="main-header justify-content-center">
            <FastFoodFinder />
          </div>
        </div>
        <div className="row home-fav-row">
          <div className="home-button d-flex align-items-center">
            <HomeButton />
          </div>
          <div className="col-1 favorites-button d-flex align-items-center">
            <FavoritesButton />
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterView;
