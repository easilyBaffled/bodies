import React, { useEffect, useRef, memo } from "react";
import { connect, useSelector } from "react-redux";
import Avatar from "boring-avatars";
import { attr } from "../../../drafting/bodies/primatives";
import { Attr } from "../../../drafting/bodies/attr";
import { Player } from "../../../drafting/bodies/player";
import { CardList } from "../../../app/CardList";
import { actions } from "../build/build.slice";

function round( value, decimals ) {
    return Number( Math.round( value + 'e' + decimals ) + 'e-' + decimals );
}

import { useAnimationFrame } from "../../useAnimationFrame";
import { moveKarts } from "../../game/game.slice";
const viewBoxSize = 50;
const viewBox = [
    -viewBoxSize / 2,
    -viewBoxSize / 2,
    viewBoxSize,
    viewBoxSize
].join( " " );

const colors = {
    'Bot 1':  '#C20D90',
    'Bot 2': '#92A1C6',
    'You':    '#F0AB3D'
};

const Kart = ({ kart, track, trackLenMapping, memoLength, name }) => {
    const len = Attr.get( kart, attr.POSITION );
    const { x, y } = trackLenMapping[ len ] ?? track?.getPointAtLength( len ) ?? { x: 0, y: 0 };

    return <circle r='1' cy={y} cx={x} fill={colors[ name ]}/>;

};

const Race = ( props ) => {
    const track = useRef();
    const { build, game } = useSelector( s => s );

    useAnimationFrame(
        ( time, totalLength, angleMapping ) => {
            props.moveKarts({ angleMapping, time, totalLength });
        },
        build.totalLength,
        build.angleMapping
    );

    return (
        <>
            <svg className='race-track-container' viewBox={viewBox}>
                <path className='race-track-path' ref={track} d={build.trackPath}/>
                {
            	Object.values( game.players )
                        .map( p => {
                            const kart = Attr.get( p, attr.KART );
                            return <Kart
                                name={p.name}
                                memoLength={props.memoLength}
                                kart={kart}
                                track={track.current}
                                trackLenMapping={build.trackLenMapping}
                            />;
                        })

                }
            </svg>
            {/* <h3>*/}
            {/*    {*/}
            {/*        Object.values( game.players ).map( p => {*/}
            {/*            const kart = Attr.get( p, attr.KART );*/}
            {/*            return round( kart.speed, 3 );*/}
            {/*        }).join( ' | ' )*/}
            {/*    }*/}
            {/* </h3>*/}
            <h3 className='header'>
               Laps: {
                    Object.values( game.players ).map( p =>
                        <>
                    		<Avatar size={25} name={p.name} variant="beam" />
                    		<code>{ p[ attr.LAPS ] }</code>
                        </>
                    )
                }
            </h3>
            <p>
				And now for the hardest part. You get to see if all your hard work has paid off.<br/>
				Each kart will take to the track and try to be the first to 10 laps.<br/>
                <br/>
				Best of Luck!
            </p>
        </>
    );
};

export default connect(
    ( s ) => {
    	return {
		 // trackPath:    s.build.trackPath,
            ...s.build,
            ...s.race
	 	};

    },
    {
        ...actions,
        moveKarts
    }
)( Race );
