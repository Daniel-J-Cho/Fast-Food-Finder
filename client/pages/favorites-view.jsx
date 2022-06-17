import React from 'react';
import HomeButton from '../components/home-button';

class FavoritesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: []
    };
    // this.renderEntryCard = this.renderEntryCard.bind(this);
  }

  // renderEntryCard() {
  //   <div className="card">
  //     <div className="card-body">
  //       <h5 className="card-title" >{this.props.restName}</h5>
  //       <p className="card-text" >{this.props.restAddress}</p>
  //       <p className="card-text">make this a bullet-pointed comment</p>
  //       <div className="row">
  //         <div className="d-flex justify-content-around">
  //           <button type="button" className="btn btn-primary">Add Comment</button>
  //           <button type="button" className="btn btn-secondary">Edit Comment</button>
  //           <button type="button" className="btn btn-warning">Delete Comment</button>
  //           <button type="button" className="btn btn-danger">Delete Location</button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>;
  // }

  render() {
    // console.log('this.props.restName:', this.props.restName);
    return (
      <div className="container">
        <div className="row">
          <div className="home-button d-flex align-items-center">
            <HomeButton />
          </div>
        </div>
        <div>
          {this.props.createCard}
        </div>
      </div>
    );
  }
}

export default FavoritesView;

// this.renderEntry = this.renderEntry.bind(this);

// renderEntry() {
//   <div className="card">
//     <div className="card-body">
//       <h5 className="card-title" >{this.props.restName}</h5>
//       <p className="card-text" >{this.props.restAddress}</p>
//       <p className="card-text">make this a bullet-pointed comment</p>
//       <div className="row">
//         <div className="d-flex justify-content-around">
//           <button type="button" className="btn btn-primary">Add Comment</button>
//           <button type="button" className="btn btn-secondary">Edit Comment</button>
//           <button type="button" className="btn btn-warning">Delete Comment</button>
//           <button type="button" className="btn btn-danger">Delete Location</button>
//         </div>
//       </div>
//     </div>
//   </div>;
// }
