import React from 'react';

class DropdownMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.onChange(event.target.textContent);
  }

  render() {
    return (
      <div className="dropdown-menu-2">
        <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenu1" data-bs-toggle="dropdown" aria-expanded="false">
          Select a restaurant
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
          <li><a className="dropdown-item" href="#" onClick={event => this.handleClick(event)} id='McDonald&apos;s'>McDonald&apos;s</a></li>
          <li><a className="dropdown-item" href="#" onClick={event => this.handleClick(event)} id= 'Taco Bell'>Taco Bell</a></li>
          <li><a className="dropdown-item" href="#" onClick={event => this.handleClick(event)} id='In-N-Out'>In-N-Out</a></li>
          <li><a className="dropdown-item" href="#" onClick={event => this.handleClick(event)} id='Chipotle'>Chipotle</a></li>
          <li><a className="dropdown-item" href="#" onClick={event => this.handleClick(event)} id='Burger King'>Burger King</a></li>
          <li><a className="dropdown-item" href="#" onClick={event => this.handleClick(event)} id='Del Taco'>Del Taco</a></li>
          <li><a className="dropdown-item" href="#" onClick={event => this.handleClick(event)} id='Carl&apos;s Jr'>Carl&apos;s Jr</a></li>
          <li><a className="dropdown-item" href="#" onClick={event => this.handleClick(event)} id='Wienerschnitzel'>Wienerschnitzel</a></li>
          <li><a className="dropdown-item" href="#" onClick={event => this.handleClick(event)} id='Subway'>Subway</a></li>
          <li><a className="dropdown-item" href="#" onClick={event => this.handleClick(event)} id='Jersey Mike&apos;s'>Jersey Mike&apos;s</a></li>
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
