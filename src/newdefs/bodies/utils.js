import { current } from "immer";
import _ from "lodash";
import { byType } from "../utils";
import { FlatWorld } from "./flatWorld";
import { attr } from "./primatives";
export const findAttributeByNodeType = ( body, attributeType ) =>
    _.find( body.attributes, byType( attributeType ) );

export const comparisonOpperators = {
    "<":   ( a, b ) => a < b,
    "<=":  ( a, b ) => a <= b,
    "===": ( a, b ) => a === b,
    ">":   ( a, b ) => a > b,
    ">=":  ( a, b ) => a >= b
};

export const rightTargetGetters = {
    // collision: ({ body, collider }) => "",
    segment: ({ world, body }) => {
        const bodyPosition = findAttributeByNodeType( body, attr.POSITION ).value;
        return FlatWorld.getSegment( world, bodyPosition );
    },
    self: ({ body }) => body
};

export const shouldApplyAffect = ( affect, body, world ) => {
    try {
        if ( !affect.condition ) return true;

        const { target, opperator, rightTarget } = affect.condition;

        const leftValue = findAttributeByNodeType( body, target.attribute ).value;
        const oppFunc = comparisonOpperators[ opperator ];

        const rightValue = findAttributeByNodeType(
            rightTargetGetters[ rightTarget.body ?? "self" ]({ body, world }),
            rightTarget.attribute
        )[ rightTarget.property ?? "value" ];

        return oppFunc( leftValue, rightValue );
    } catch ( e ) {
        console.error(
            "shouldApplyAffect",
            current( affect ),
            current( body ),
            current( world )
        );
        throw e;
    }
};
