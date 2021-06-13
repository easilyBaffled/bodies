import { createSlice } from '@reduxjs/toolkit';
import { Player } from '../../drafting/bodies/player';
import { toDictById } from "../../drafting/bodies/utils";
import { pickAKart } from "../pages/pickAKart/pickAKart.slice";
import { pickACard } from "../pages/draft/draft.slice";
import { addSegment } from "../pages/build/build.slice";
import { Attr, memoGet } from '../../newdefs/bodies/Attr';
import { attr } from '../../drafting/bodies/primatives';
import { Kart } from "../../drafting/bodies/kart";
import { deltaTime } from "../pages/race/race.slice";

function round( value, decimals ) {
    return Number( Math.round( value + 'e' + decimals ) + 'e-' + decimals );
}

/**
 * Normalizes a value from one range (current) to another (new).
 *
 * @param  { Number } val    //the current value (part of the current range).
 * @param  { Number } minVal //the min value of the current value range.
 * @param  { Number } maxVal //the max value of the current value range.
 * @param  { Number } newMin //the min value of the new value range.
 * @param  { Number } newMax //the max value of the new value range.
 *
 * @returns { Number } the normalized value.
 */
const normalizeBetweenTwoRanges = ( val, minVal, maxVal, newMin, newMax ) => {
    return newMin + ( ( val - minVal ) * ( newMax - newMin ) ) / ( maxVal - minVal );
};
const normalizeHandling = ( h ) => normalizeBetweenTwoRanges( h, 2.5, 5, 0, 2 );
const normalizeLen = ( len ) => normalizeBetweenTwoRanges( len, 3, 12, 5, 0 );
const normalizePenalty = ( length, handling ) => normalizeLen( length ) + normalizeHandling( handling );

/* eslint-disable sort-keys-fix/sort-keys-fix */
export const pages = {
    "PICKAKART":   "PICKAKART",
    "DRAFT":       "DRAFT",
    "BUILDATRACK": "BUILDATRACK",
    "RACE":        "RACE",
    "GAMEOVER":    "GAMEOVER"
};
/* eslint-enable sort-keys-fix/sort-keys-fix */

const getNextKey = ( obj, id ) => {
    const list = Object.keys( obj );
    const i = list.indexOf( id ) + 1;
    return list[ ( i === list.length ) ? 0 : i ];
};

const players = toDictById(
    Player.create({ isABot: false, name: 'You' }),
    Player.create({ name: 'Bot 2' }),
    // Player.create({ name: 'Mario' }),
    Player.create({ name: 'Bot 1' })
);
const turnOrder = Object.keys( players );
const activePlayerId = turnOrder[ 0 ];

const initialState = {
    activePlayerId,
    currentPage:  pages.PICKAKART,
    pages,
    players,
    turnOrder,
    winner:      null
};

const gameSlice = createSlice({
    extraReducers: {
    	[ addSegment ]: ( state, { payload }) => {
            const { maxLength, currentLength, seg } = payload;
            const cards = Attr.get( state.players[ state.activePlayerId ], attr.CARDS );
            const index = cards.findIndex( c => c.id === seg.id );
            cards.splice( index, 1 );
            gameSlice.caseReducers.nextTurn( state );

            if ( currentLength >= maxLength )
                gameSlice.caseReducers.progressPage( state );

        },
    	[ pickACard ]: ( state, { payload }) => {
    		const { card, remainingCards } = payload;
            Attr.add( state.players[ state.activePlayerId ], attr.CARDS, card );
            if ( !remainingCards ) {
                Object.values( state.players ).forEach(
                    p => {
                        const kart = Attr.get( p, attr.KART );
                        const cards = Attr.get( p, attr.CARDS ).slice().sort(
                            ( a, b ) => Kart.evaluateSegment( kart, a ) - Kart.evaluateSegment( kart, b )
                        );

                        Attr.set( p, attr.CARDS, cards );
                    }
                );
                gameSlice.caseReducers.nextTurn( state );
                gameSlice.caseReducers.progressPage( state );
            } else
                gameSlice.caseReducers.nextTurn( state );
        },
        [ pickAKart ]: ( state, { payload: kart }) => {
            Attr.set( state.players[ state.activePlayerId ], attr.KART, kart );
            if ( state.activePlayerId === state.turnOrder[ 2 ]) {
                gameSlice.caseReducers.nextTurn( state );
                gameSlice.caseReducers.progressPage( state );
            } else
                gameSlice.caseReducers.nextTurn( state );
        }
    },
    initialState,
    name:     'game',
    reducers: {
    	moveKarts( s, { payload }) {
    		const { totalLength, angleMapping } = payload;
    		Object.values( s.players ).forEach( p => {
                const kart = memoGet( p, attr.KART );
                const { maxSpeed, handling, accel, speed } = kart;
                const mod = 0.001;
                const pos = kart.attributes[ attr.POSITION ].value;// Attr.get( kart, attr.POSITION );



                { // Accelerate

                    kart.speed += accel * deltaTime * mod;

                    const closest = Object.keys( angleMapping ).reduce( ( prev, curr ) => {
                        return ( Math.abs( curr - pos ) < Math.abs( prev - pos ) ? curr : prev );
                    });
                    const { angle, len } = angleMapping[ closest ];
                    if ( angle < 180 ) {
                        const turnPenalty = normalizeLen( len );
                        console.log({ handling, len, turnPenalty });
                        kart.speed -= ( turnPenalty - handling ) * deltaTime * mod;
                    }

                    if ( speed * mod > maxSpeed * 0.0001 )
                    	kart.speed = maxSpeed * 0.0001;

                }

                if ( pos + kart.speed >= totalLength ) {
                    p[ attr.LAPS ] += 1;
                    if ( p[ attr.LAPS ] > 10 ) {
                        s.winner = p;
                        s.currentPage = getNextKey( s.pages, s.currentPage );
                    }

                }

                kart.attributes[ attr.POSITION ].value = round(
                	pos + kart.speed >= totalLength
                        ? pos + kart.speed - totalLength
                        : pos + kart.speed,
                    3
                );
            });

        },
    	nextTurn( s = {}) {
            const i = s.turnOrder.indexOf( s.activePlayerId ) + 1;
            if ( i === s.turnOrder.length )
                s.turnOrder.unshift( s.turnOrder.pop() );
            else s.activePlayerId = s.turnOrder[ i ];
        },
    	progressPage( s ) {
    		s.currentPage = getNextKey( s.pages, s.currentPage );
    		if ( s.currentPage === pages.PICKAKART )
    			s = initialState;

        }
    }
});

export const { progressPage, nextTurn, moveKarts } = gameSlice.actions;

export default gameSlice.reducer;
