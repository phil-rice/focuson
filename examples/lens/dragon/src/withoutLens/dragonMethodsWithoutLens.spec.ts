//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS

import {damage, eat, heal} from "./dragonMethodsWithoutLens";
import {Dragon} from "../../index";


export let startDragon: Dragon = {
    body: {
        chest: {
            hitpoints: 10,
            stomach: {
                contents: ['the adventurer']
            }
        },
        leftWing: {hitpoints: 5},
        rightWing: {hitpoints: 5}
    },
    head: {hitpoints: 5, leftEye: {color: "blue"}, rightEye: {color: "green"}}
}
let secondAdventurer = 'a second adventurer'

export let dragonWithASecondAdventurer: Dragon = {
    body: {
        chest: {
            hitpoints: 10,
            stomach: {
                contents: ['the adventurer', 'a second adventurer']
            }
        },
        leftWing: {hitpoints: 5},
        rightWing: {hitpoints: 5}
    },
    head: {hitpoints: 5, leftEye: {color: "blue"}, rightEye: {color: "green"}}
}

export let dragonWithChestOn6Hitpoints: Dragon = {
    body: {
        chest: {
            hitpoints: 6,
            stomach: {
                contents: ['the adventurer']
            }
        },
        leftWing: {hitpoints: 5},
        rightWing: {hitpoints: 5}
    },
    head: {hitpoints: 5, leftEye: {color: "blue"}, rightEye: {color: "green"}}
}
export let dragonWithChestOn0Hitpoints: Dragon = {
    body: {
        chest: {
            hitpoints: 0,
            stomach: {
                contents: ['the adventurer']
            }
        },
        leftWing: {hitpoints: 5},
        rightWing: {hitpoints: 5}
    },
    head: {hitpoints: 5, leftEye: {color: "blue"}, rightEye: {color: "green"}}
}
export let dragonWithLeftWingOn2Hitpoints: Dragon = {
    body: {
        chest: {
            hitpoints: 10,
            stomach: {
                contents: ['the adventurer']
            }
        },
        leftWing: {hitpoints: 2},
        rightWing: {hitpoints: 5}
    },
    head: {hitpoints: 5, leftEye: {color: "blue"}, rightEye: {color: "green"}}
}
export let dragonWithLeftWingOn0Hitpoints: Dragon = {
    body: {
        chest: {
            hitpoints: 10,
            stomach: {
                contents: ['the adventurer']
            }
        },
        leftWing: {hitpoints: 0},
        rightWing: {hitpoints: 5}
    },
    head: {hitpoints: 5, leftEye: {color: "blue"}, rightEye: {color: "green"}}
}
export let dragonWithRightWingOn2Hitpoints: Dragon = {
    body: {
        chest: {
            hitpoints: 10,
            stomach: {
                contents: ['the adventurer']
            }
        },
        leftWing: {hitpoints: 5},
        rightWing: {hitpoints: 2}
    },
    head: {hitpoints: 5, leftEye: {color: "blue"}, rightEye: {color: "green"}}
}
export let dragonWithRightWingOn0Hitpoints: Dragon = {
    body: {
        chest: {
            hitpoints: 10,
            stomach: {
                contents: ['the adventurer']
            }
        },
        leftWing: {hitpoints: 5},
        rightWing: {hitpoints: 0}
    },
    head: {hitpoints: 5, leftEye: {color: "blue"}, rightEye: {color: "green"}}
}
export let dragonWithHeadOn2Hitpoints: Dragon = {
    body: {
        chest: {
            hitpoints: 10,
            stomach: {
                contents: ['the adventurer']
            }
        },
        leftWing: {hitpoints: 5},
        rightWing: {hitpoints: 5}
    },
    head: {hitpoints: 2, leftEye: {color: "blue"}, rightEye: {color: "green"}}
}
export let dragonWithHeadOn0Hitpoints: Dragon = {
    body: {
        chest: {
            hitpoints: 10,
            stomach: {
                contents: ['the adventurer']
            }
        },
        leftWing: {hitpoints: 5},
        rightWing: {hitpoints: 5}
    },
    head: {hitpoints: 0, leftEye: {color: "blue"}, rightEye: {color: "green"}}
}

describe('dragon without lens', () => {
    it("should have an eat method", () => {
        expect(eat(startDragon, secondAdventurer)).toEqual(dragonWithASecondAdventurer)
    })
    it("should have a damage head method", () => {
        expect(damage(startDragon, 'head', 3)).toEqual(dragonWithHeadOn2Hitpoints)
        expect(damage(dragonWithHeadOn2Hitpoints, 'head', 3)).toEqual(dragonWithHeadOn0Hitpoints)
    })
    it("should have a damage leftWing method", () => {
        expect(damage(startDragon, 'leftwing', 3)).toEqual(dragonWithLeftWingOn2Hitpoints)
        expect(damage(dragonWithLeftWingOn2Hitpoints, 'leftwing', 3)).toEqual(dragonWithLeftWingOn0Hitpoints)
    })
    it("should have a damage rightWing method", () => {
        expect(damage(startDragon, 'rightwing', 3)).toEqual(dragonWithRightWingOn2Hitpoints)
        expect(damage(dragonWithRightWingOn2Hitpoints, 'rightwing', 3)).toEqual(dragonWithRightWingOn0Hitpoints)
    })
    it("should have a damage chest method", () => {
        expect(damage(startDragon, 'chest', 4)).toEqual(dragonWithChestOn6Hitpoints)
        expect(damage(dragonWithChestOn6Hitpoints, 'chest', 10)).toEqual(dragonWithChestOn0Hitpoints)
    })
    it("should have a heal head method", () => {
        expect(heal(dragonWithHeadOn0Hitpoints, 'head', 5, 2)).toEqual(dragonWithHeadOn2Hitpoints)
        expect(heal(dragonWithHeadOn2Hitpoints, 'head', 5, 10)).toEqual(startDragon)
    })
    it("should have a heal leftWing method", () => {
        expect(heal(dragonWithLeftWingOn0Hitpoints, 'leftwing', 5, 2)).toEqual(dragonWithLeftWingOn2Hitpoints)
        expect(heal(dragonWithLeftWingOn2Hitpoints, 'leftwing', 5, 5)).toEqual(startDragon)
    })
    it("should have a heal rightWing method", () => {
        expect(heal(dragonWithRightWingOn0Hitpoints, 'rightwing', 5, 2)).toEqual(dragonWithRightWingOn2Hitpoints)
        expect(heal(dragonWithRightWingOn2Hitpoints, 'rightwing', 5, 5)).toEqual(startDragon)
    })
    it("should have a heal chest method", () => {
        expect(heal(dragonWithChestOn0Hitpoints, 'chest', 10, 6)).toEqual(dragonWithChestOn6Hitpoints)
        expect(heal(dragonWithChestOn6Hitpoints, 'chest', 10, 12)).toEqual(startDragon)
    })
})



