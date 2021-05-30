import { current } from "immer";
import { Effect } from "./Effect";
import { shouldApplyAffect } from "./utils";

export class Body {
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
        if ( shouldApplyAffect( affect, applicableBody, world ) )
            Body.applyAffectToBody( applicableBody, affect );
        Effect.tickDown( affect );
    }

    static emit( body, eventType ) {
        console.log( body, eventType );
    // 1. get bodies event object
    // 2. get event's affects
    // 3. apply affects
    }
}
