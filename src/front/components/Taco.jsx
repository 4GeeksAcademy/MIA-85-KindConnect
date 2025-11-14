import React from "react";
import tacoImg from "/workspaces/MIA-85-KindConnect/src/front/assets/img/taco.jpg";
import "../styles/pages/Taco.css";


export default function Taco() {
    return (
        <header className="food__Taco">
            <div className="taco__header">
                <h1 className="taco__title">
                    Food Donations{" "}
                    <span
                        className="TacoEmoji TacoEmoji--title"
                        style={{ backgroundImage: `url(${tacoImg})` }}
                        aria-hidden="true"
                    ></span>
                </h1>
                <p className="Taco__subtitle">
                    Connect with your community to give and receive food assistance.<br />
                    Share meals, groceries, and resources to help those in need.
                </p>
            </div>
        </header>
    );
}
