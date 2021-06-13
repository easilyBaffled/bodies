import React from "react";
import { Attr } from "../drafting/bodies/attr";
import { attr } from "../drafting/bodies/primatives";

const viewBoxSize = 36;
const viewBox = [
    -viewBoxSize / 2,
    -viewBoxSize / 2,
    viewBoxSize,
    viewBoxSize
].join( " " );

export const TrackCard = ({ card, render, clickHandler }) =>
    <div
        className="card shadow-1 segment"
        key={card.id}
        onClick={() => clickHandler( card )}
    >
        {render ?  render( card ) : (
            <>
                <div>
                    {/* <code>angle: {Math.round( Attr.get( card, attr.ANGLE ) )}</code>*/}
                    <code>length: {Math.round( Attr.get( card, attr.LENGTH ) )}</code>
                </div>
                <svg className="path-container" viewBox={viewBox}>
                    <path className="path" d={Attr.get( card, attr.PATHSTR )} />
                </svg>
            </>
        )}
    </div>;

export const CardList = ({ cards, ...cardDetails }) => {
    return (
        <div className="card-list">
            {cards.map( ( card ) => (
                <TrackCard key={card.id} card={card} {...cardDetails} />
            ) )}
        </div>
    );
};
