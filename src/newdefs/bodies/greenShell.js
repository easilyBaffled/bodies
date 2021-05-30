import { toDictById, withTypesForIds } from "../utils";
import { attr, attribute, affectTargets, events } from "./primatives";

export const greenShell = {
    attributes: {
        [ attr.SPEED ]: attribute.speed({
            value: 4
        }),
        [ attr.POSITION ]: attribute.position({
            value: 0
        }),
        [ attr.ALIVE ]: {
            id:    attr.ALIVE,
            type:  attr.ALIVE,
            value: true
        }
    },
    events: toDictById(
        withTypesForIds(
            {
                actions: [ 3 ],

                type: events.TICK
            },
            {
                actions: [ "stun", "selfDestruct" ],
                type:    events.COLLISION
            },
            {
                actions: [ "create" ],
                type:    events.USE
            }
        )
    ),
    id:              "greenShell",
    name:            "greenShell",
    standardAffects: {
        3: {
            func:            "add",
            id:              3,
            targetAttribute: attr.POSITION,
            type:            "move",
            value:           1
        },
        create: {
            func:            "add",
            id:              "create",
            targetAttribute: attr.BODIES,
            targetBody:      affectTargets.WORLD,
            type:            "create"
        },
        selfDestruct: {
            func:            "set",
            id:              "selfDestruct",
            targetAttribute: attr.ALIVE,
            type:            "selfDestruct",
            value:           false
        },
        stun: {
            func:            "set",
            id:              "stun",
            targetAttribute: attr.SPEED,
            targetBody:      affectTargets.COLLIDER,
            type:            "stun",
            value:           0
        }
    },
    temporaryAffects: {}
};
