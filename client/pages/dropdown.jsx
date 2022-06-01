import React from 'react';

function DropdownMenu(props) {
  return (
    <div className="dropdown">
      <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenu1" data-bs-toggle="dropdown" aria-expanded="false">
        Select a restaurant
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
        <li><a className="dropdown-item" href="#">McDonald&apos;s</a></li>
        <li><a className="dropdown-item" href="#">Taco Bell</a></li>
        <li><a className="dropdown-item" href="#">In-N-Out</a></li>
        <li><a className="dropdown-item" href="#">Chipotle</a></li>
        <li><a className="dropdown-item" href="#">Burger King</a></li>
        <li><a className="dropdown-item" href="#">Del Taco</a></li>
        <li><a className="dropdown-item" href="#">Carl&apos;s Jr</a></li>
        <li><a className="dropdown-item" href="#">Wienerschnitzel</a></li>
        <li><a className="dropdown-item" href="#">Subway</a></li>
        <li><a className="dropdown-item" href="#">Jersey Mike&apos;s</a></li>
      </ul>
    </div>
  );
}

export default DropdownMenu;
