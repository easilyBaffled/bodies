/**
 *
 * @type {{HANDLING: string, SPEED: string, POSITION: string, BODIES: string, POWER: string, ALIVE: string, LEVEL: string}}
 */
/**
 * Primatives
 */

/**
 * A non-scaled position in a 2D world
 * @typedef {Object} WorldPos
 * @property {number} x
 * @property {number} y
 */

/**
 * Indicate where this Element is, for example a card can be in a deck or in the track
 * @typedef {Object} In
 * @property {string} type
 * @property {string} id
 */

/**
 * A number that wraps around from min to max, rather than being clamped
 * @typedef {Object} WrappingNumber
 * @property {number} value
 * @property {number} min
 * @property {number} max
 */

/**
 * A number that will stay at the min or max rather then exceeding them
 * @typedef {Object} ClampedNumber
 * @property {number} value
 * @property {number} min
 * @property {number} max
 */

/**
 * A number that will stay at the min or max rather then exceeding them
 * @typedef {Object} Attribute
 * @property {string} id
 * @property {string} type
 * @property {*} value
 */

/**
 * Kart Properties
 */

/**
 * @typedef {number} TopSpeed
 */

/**
 * @typedef {number} Accel
 */

/**
 * @typedef {ClampedNumber} Speed
 */

/**
 * @typedef {number} Handling
 */

/**
 * @typedef {Object} TrackPos
 * @property {string} trackId
 * @property {number} length
 */


/**
 * Track Segment Properties
 */

/**
 * @typedef {number} Length
 */

/**
 * @typedef {number} Angle
 */

/**
 * @typedef {Object} Path
 * @property {WorldPos} ControlPoint
 * @property {WorldPos} EndPoint
 */

/**
 * @typedef {string} PathString
 */

export const MAXLENGTH = 10;

export const attr = {
    ACCEL:     "acceleration",
    ALIVE:     "ALIVE",
    ANGLE:     'ANGLE',
    BODIES:    "BODIES",
    CARDS:     'CARDS',
    HANDLING:  "handling",
    IS_A_BOT:  "isABot",
    KART:      "KART",
    LAPS:      "LAPS",
    LENGTH:    'LENGTH',
    LEVEL:     "LEVEL",
    MAX_SPEED: "MAX_SPEED",
    PATHSTR:   'PATHSTR',
    POSITION:  "position",
    POWER:     "power",
    SPEED:     "speed"
};

export const events = {
    COLLISION: "COLLISION",
    SPAWN:     "SPAWN",
    TICK:      "TICK",
    USE:       "USE"
};
export const time = {
    TICK: 1
};

export const affect = {
    ACCEL: "accelerate",
    MOVE:  "move",
    NORM:  "normalize-speed"
};

export const affectTargets = {
    ALL:      "ALL",
    COLLIDER: "COLLIDER",
    HOLDER:   "HOLDER",
    RANGE:    "RANGE",
    SELF:     "SELF",
    WORLD:    "WORLD"
};

export const placement = {
    AHEAD:  'AHEAD',
    BEHIND: 'BEHIND'
};

export const attribute = ({ type, id, value }) => ({
    id: id ?? type,
    type,
    value
});
attribute.speed = ({ value, maxValue }) =>
    attribute({
        id:   attr.SPEED,
        maxValue,
        type: attr.SPEED,
        value
    });
attribute.position = ({ value }) =>
    attribute({
        id:   attr.POSITION,
        type: attr.POSITION,
        value
    });
attribute.handling = ({ value, maxValue }) =>
    attribute({
        id:   attr.HANDLING,
        maxValue,
        type: attr.HANDLING,
        value
    });

export const opp = {
    eq:          "===",
    greaterThan: ">",
    lessThan:    "<"
};

export const condition = ( left, right, type ) => ({
    condition: {
        opperator:   type,
        rightTarget: {
            type:      "target",
            ...right
        },
        target: {
            type:      "target",
            ...left
        },
        type: "BinaryCondition"
    }
});

condition.greaterThan = ( ...args ) => condition( ...args, opp.greaterThan );
condition.lessThan = ( ...args ) => condition( ...args, opp.lessThan );
