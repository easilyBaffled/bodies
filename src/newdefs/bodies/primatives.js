export const attr = {
    ALIVE:    "ALIVE",
    BODIES:   "BODIES",
    HANDLING: "handling",
    LEVEL:    "LEVEL",
    POSITION: "position",
    POWER:    "power",
    SPEED:    "speed"
};

export const events = {
    COLLISION: "COLLISION",
    TICK:      "TICK",
    USE:       "USE"
};
export const time = {
    TICK: 1
};

export const affectTargets = {
    COLLIDER: "COLLIDER",
    HOLDER:   "HOLDER",
    RANGE:    "RANGE",
    SELF:     "SELF",
    WORLD:    "WORLD"
};

export const attribute = ({ type, id, value, maxValue }) => ({
    id: id ?? type,
    maxValue,
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
