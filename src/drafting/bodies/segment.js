import { memoize } from 'lodash';
import { toDictById, withTypesForIds } from "./utils";
import { attr, affect, attribute, events, condition, opp } from "./primatives";
import { Attr } from './attr';

export const q = ( p ) => {
    const path = Array.isArray( p ) ? p[ 0 ] : p;
    const [ dx1, dy1, dx, dy ] = path.replace( /[mM]\s+\d+\s+\d+\s+/, "" ).replace( /[qQ]\s+/, "" ).split( " " ).map( Number );
    return {
        controlPoint: {
            x: dx1,
            y: dy1
        },
        dx,
        dx1,
        dy,
        dy1,
        endPoint: {
            x: dx,
            y: dy
        }
    };
};

export const createPathEl = memoize( ( str ) => {
    const path = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
    path.setAttributeNS( null, "d", "m 0 0 " + str );

    return path;
});

export const pointToStr = ({ x, y }) => `${x} ${y}`;

export const pointsToQ = ( controlPoint, endPoint ) =>
    `q ${pointToStr( controlPoint )} ${pointToStr( endPoint )}`;

export function find_angle( A, B, C ) {
    const AB = Math.sqrt( Math.pow( B.x - A.x, 2 ) + Math.pow( B.y - A.y, 2 ) );
    const BC = Math.sqrt( Math.pow( B.x - C.x, 2 ) + Math.pow( B.y - C.y, 2 ) );
    const AC = Math.sqrt( Math.pow( C.x - A.x, 2 ) + Math.pow( C.y - A.y, 2 ) );

    return Math.acos( ( BC * BC + AB * AB - AC * AC ) / ( 2 * BC * AB ) );
}

find_angle.deg = ( A, B, C ) => ( find_angle( A, B, C ) * 180 ) / Math.PI;


export class Segment {
    static create( opt, name ) {
        const { controlPoint, endPoint } =  ( typeof opt === 'string' ) ? q( opt ) : opt;
        const pathStr = "m 0 0 " + pointsToQ( controlPoint, endPoint );
        const path = createPathEl( pathStr );

        return {
            attributes: toDictById(
                withTypesForIds(
                    attribute({ type: attr.LENGTH, value: path.getTotalLength()  }),
                    attribute({ type: attr.ANGLE, value: find_angle.deg({ x: 0, y: 0 }, controlPoint, endPoint )  }),
                    attribute({ type: attr.PATHSTR, value: pathStr })
                )
            ),
            events:           {},
            holding:          {},
            id:               name,
            name,
            standardAffects:  {},
            temporaryAffects: {}
        };
    }
}
