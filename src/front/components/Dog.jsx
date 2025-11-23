import React from "react";
import dogImg from "/workspaces/MIA-85-KindConnect/src/front/assets/img/c:d.jpg";
import "../styles/pages/Dog.css";

export default function Dog() {
    return (
        <header className="animal__Dog">
            <div className="animal__header">
                <h1 className="animal__title">
                    Helping Animal's{" "}
                    <span
                        className="DogEmoji DogEmoji--title"
                        style={{ backgroundImage: `url(${dogImg})` }}
                        aria-hidden="true"
                    ></span>
                </h1>

                <p className="Animal__subtitle">
                    Find help for your furry friends—food, shelter, and care.<br />
                    Offer your support or request assistance from fellow animal lovers.
                </p>
            </div>
        </header>
    );
}   
