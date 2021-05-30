import { toDictById } from "../utils";
import { attr, affectTargets, events } from "./primatives";

export const mushroom = {
    attributes: {},
    events:     {
        [ events.TICK ]: {
            actions: [ 3 ],
            id:      4,
            type:    events.TICK
        },
        [ events.USE ]: {
            actions: [ "accellerate" ],
            id:      5,
            type:    events.COLLISION
        }
    },
    id:              "mushroom",
    name:            "mushroom",
    standardAffects: toDictById({
        func:            "add",
        id:              "accellerate",
        targetAttribute: attr.SPEED,
        targetBody:      affectTargets.HOLDER,
        type:            "accellerate",
        value:           5
    }),
    temporaryAffects: {}
};
