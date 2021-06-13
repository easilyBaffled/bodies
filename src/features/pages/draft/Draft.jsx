import React, { useEffect } from "react";
import { connect } from "react-redux";
import { attr } from "../../../drafting/bodies/primatives";
import { Attr } from "../../../drafting/bodies/attr";
import { Player } from "../../../drafting/bodies/player";
import { CardList } from "../../../app/CardList";
import { actions } from "./draft.slice";
const viewBoxSize = 20;
const viewBox = [
    -viewBoxSize / 2,
    -viewBoxSize / 2,
    viewBoxSize,
    viewBoxSize
].join( " " );

const Draft = ({ showingCards, availableCards, pickACard, activePlayer }) => {
    const isABot = Attr.get( activePlayer, attr.IS_A_BOT );
    useEffect( () => {

        if ( isABot ) {
            const timeoutId = setTimeout( () => {
                const card = Player.getPreferedCard( activePlayer, showingCards );
                pickACard({ card, remainingCards: availableCards.length });
            }, 1000 );
            return () => clearTimeout( timeoutId );
        }
    }, [ activePlayer ]);

    return (
        <>
            <h3>Cards Left: {availableCards.length}</h3>

            <CardList cards={Object.values( showingCards )} clickHandler={( card ) =>
                !isABot && pickACard({ card, remainingCards: availableCards.length })}/>

            <h3>Draft Your Deck!</h3>
            <p>
				This is where things really deviate from your use party kart racer.<br/>
				In the draft you will build your deck of track segments. <br/>
				For curved tracks, the shorter the length the more you're going to need good handling.<br/>
				So if you picked a kart with a high top speed but low handling, maybe you should pick the bigger bends and straightaways.<br/>
				Don't worry if you don't see a card you like, there is always more cards then will be necessary to build the track.
                <br/>
				This is a snake draft so who ever was last in the previous round, goes first in the next round.<br/>
            </p>
        </>
    );
};

export default connect(
    ( s ) => ({
        activePlayer: s.game.players[ s.game.activePlayerId ],
        ...s.draft
    }),
    actions
)( Draft );
