import React from 'react';


function MyCard(){
    return (
        <div className="card" style={{width: "18rem"}}>
          <div className="card-body">
            <h5 className="card-title">Categories</h5>
            <button className="card-text">Animal</button>
            <button className="card-text">Food</button>
            <button className="card-text">Honey Do's</button>
          </div>
        </div>
    );
}