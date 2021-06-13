import produce, { current } from "immer";
import { flow } from "lodash";
import { Effect } from "./Effect";
import { shouldApplyAffect } from "./utils";
import { attr, placement } from "./primatives";
import { Attr } from "./Attr";

export class Body {
    static add( body, attribute, value ) {
    	const target =  Attr.get( body, attribute );
    	const res = Effect.add( target, value );
    }
    static getPosition( body, modifier = 'default' ) {
    	const pos = body.attributes[ attr.POSITION ].value;

        const mod = {
            [ placement.AHEAD ]:  pos + 1,
            [ placement.BEHIND ]: pos - 1,
            default:              pos
        };

        return mod[ modifier ];
    }

    static getBodyEffectById( body, id ) {
        return body.standardAffects[ id ] || body.temporaryAffects[ id ];
    }

    static getBodyEventAffects( body, eventType ) {
        const affectIds = body.events[ eventType ].actions;
        return affectIds.map( ( id ) => Body.getBodyEffectById( body, id ) );
    }

    static applyAffectToBody( body, affect ) {
        try {
            const func = Effect.getAffectFunc( affect );
            const target = Effect.getAffectTargetAttribute( body, affect );

            target.value = func( target.value );
        } catch ( e ) {
            console.error( "applyAffectToBody", current( body ), current( affect ) );
            throw e;
        }
    }

    static applyEffect( affect, targetDef, world ) {
        const applicableBody = Effect.getEffectTargetBody( affect, targetDef );
        [].concat( applicableBody ).forEach( b => {
            if ( shouldApplyAffect( affect, b, world ) )
                Body.applyAffectToBody( b, affect );

        });

        Effect.tickDown( affect );
    }

    static getEventAffects( body, eventType ) {
        const affectIds = body.events[ eventType ].actions;
        return affectIds.map( ( id ) => body.standardAffects[ id ] || body.temporaryAffects[ id ]);
    }

    static emit( body, eventType ) {
        console.log( body, eventType );
    // 1. get bodies event object
    // 2. get event's affects
    // 3. apply affects
    }
}
