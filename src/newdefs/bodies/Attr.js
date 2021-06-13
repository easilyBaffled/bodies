import kindOf from "kind-of";
import { isNil, memoize } from 'lodash';
import { match } from "../utils";

export const memoGet = memoize( ( attrOrBody, id, valueId ) => {
    let attr = attrOrBody.attributes && !attrOrBody.value ? attrOrBody.attributes[ id ] : attrOrBody;

    return isNil( valueId )
        ? attr.value
        : match(
            {
                array:   () => attr.value[ valueId ],
                default: () => attr.value,
                object:  () => attr.value[ valueId ]
            },
            kindOf( attr.value )
        );
});

export class Attr {
    static set( body, attr, value ) {
        const target = body.attributes[ attr ];
        target.value = value;

    }

    static add( body, attr, value ) {
        const target = body.attributes[ attr ];
    	target.value = match(
            {
                array:   () => target.value.concat( value ),
                default: () => target.value + value,
                object:  () => {
                    if ( !( 'id' in value ) ) {
                        throw new Error(
                            `${JSON.stringify( value, null, 2 )} must have an id`
                        );
                    }
                    return Object.assign( target.value, { [ value.id ]: value });
                }
            },
            kindOf( target.value )
        );
    }

    static get( ...args ) {
        const [ attrOrBody, id, valueId ] = args;

        let attr = attrOrBody.attributes && !attrOrBody.value ? attrOrBody.attributes[ id ] : attrOrBody;

        return isNil( valueId )
            ? attr.value
            : match(
                {
                    array:   () => attr.value[ valueId ],
                    default: () => attr.value,
                    object:  () => attr.value[ valueId ]
                },
                kindOf( attr.value )
            );
    }
}
