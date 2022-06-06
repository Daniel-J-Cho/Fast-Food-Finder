import React from 'react';

class DropdownMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { franchiseName: '' };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(id) {
    if (this.state.franchiseName !== id) {
      this.setState({ franchiseName: id });
      // console.log(this.state);
    }
  }

  render() {
    return (
      <div className="dropdown-menu-2">
        <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenu1" data-bs-toggle="dropdown" aria-expanded="false">
          Select a restaurant
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
          <li><a className="dropdown-item" href="#" onClick={this.handleClick} id='McDonald&apos;s'>McDonald&apos;s</a></li>
          <li><a className="dropdown-item" href="#" onClick={this.handleClick} id= 'Taco Bell'>Taco Bell</a></li>
          <li><a className="dropdown-item" href="#" onClick={this.handleClick} id='In-N-Out'>In-N-Out</a></li>
          <li><a className="dropdown-item" href="#" onClick={this.handleClick} id='Chipotle'>Chipotle</a></li>
          <li><a className="dropdown-item" href="#" onClick={this.handleClick} id='Burger King'>Burger King</a></li>
          <li><a className="dropdown-item" href="#" onClick={this.handleClick} id='Del Taco'>Del Taco</a></li>
          <li><a className="dropdown-item" href="#" onClick={this.handleClick} id='Carl&apos;s Jr'>Carl&apos;s Jr</a></li>
          <li><a className="dropdown-item" href="#" onClick={this.handleClick} id='Wienerschnitzel'>Wienerschnitzel</a></li>
          <li><a className="dropdown-item" href="#" onClick={this.handleClick} id='Subway'>Subway</a></li>
          <li><a className="dropdown-item" href="#" onClick={this.handleClick} id='Jersey Mike&apos;s'>Jersey Mike&apos;s</a></li>
        </ul>
      </div>
    );
  }
}

// function DropdownMenu(props) {
// return (
//   <div className="dropdown">
//     <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenu1" data-bs-toggle="dropdown" aria-expanded="false">
//       Select a restaurant
//     </button>
//     <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
//       <li><a className="dropdown-item" href="#">McDonald&apos;s</a></li>
//       <li><a className="dropdown-item" href="#">Taco Bell</a></li>
//       <li><a className="dropdown-item" href="#">In-N-Out</a></li>
//       <li><a className="dropdown-item" href="#">Chipotle</a></li>
//       <li><a className="dropdown-item" href="#">Burger King</a></li>
//       <li><a className="dropdown-item" href="#">Del Taco</a></li>
//       <li><a className="dropdown-item" href="#">Carl&apos;s Jr</a></li>
//       <li><a className="dropdown-item" href="#">Wienerschnitzel</a></li>
//       <li><a className="dropdown-item" href="#">Subway</a></li>
//       <li><a className="dropdown-item" href="#">Jersey Mike&apos;s</a></li>
//     </ul>
//   </div>
// );
// }

export default DropdownMenu;
