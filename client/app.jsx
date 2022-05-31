import React from 'react';
import Home from './pages/home';
import { parseRoute } from './lib';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
  }

  render() {
    return (
    <div className="container">
      <h1 className="text-center">Fast Food Finder</h1>
        <a href="#" className="btn btn-primary"><i className="fa fa-home"></i></a>
      <Home />
    </div>
    );
  }
}
