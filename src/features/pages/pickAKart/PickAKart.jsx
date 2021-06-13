import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Attr } from "../../../drafting/bodies/attr";
import { attr } from "../../../drafting/bodies/primatives";
import { CardList } from "../../../app/CardList";
import { pickAKart } from "./pickAKart.slice";

const PickAKart = ({ activePlayer, availableKarts, pickAKart }) => {
    const kartList = Object.values( availableKarts );
    const isABot = Attr.get( activePlayer, attr.IS_A_BOT );
    useEffect( () => {
        if ( isABot ) {
            const shuffledList = kartList.sort( () => 0.5 - Math.random() );

            const timeoutId = setTimeout( () => {
                pickAKart( shuffledList[ 0 ]);
            }, 1000 );
            return () => clearTimeout( timeoutId );
        }
    }, [ activePlayer ]);

    return (
    	<>
            <CardList
                cards={kartList}
                clickHandler={( k ) => !isABot && pickAKart( k )}
                render={( k ) => (
                    <>
                        <code>{k.name}</code>
                        <div className="stats">
                            <code>Top Speed: {k.maxSpeed}</code>
                            <code>Handling: {k.handling}</code>
                            <code>Acceleration: {k.accel}</code>
                        </div>
                    </>
                )}
            />
            <h3>Pick Your Kart!</h3>
            <p>
				Each kart is quite different.<br/>
				Karts with higher Top Speeds will do better in the straightaways.<br/>
				Karts with a low handling are going to have hard time with tight turns.<br/>
                <br/>
				You get to go first! Then your two AI opponents will pick.
            </p>
        </>
    );
};

export default connect(
    ( s ) => ({
        activePlayer: s.game.players[ s.game.activePlayerId ],
        ...s.pickAKart
    }),
    {
        pickAKart
    }
)( PickAKart );
