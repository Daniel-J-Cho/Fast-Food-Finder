import React from 'react';
import FastFoodFinder from '../components/fast-food-finder.jsx';
import RegisterButton from '../components/register-button';

export default function MainHeader(props) {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 d-flex justify-content-end">
          <RegisterButton />
        </div>
      </div>
      <div className="row justify-content-center">
        <FastFoodFinder />
      </div>
    </div>
  );
}
