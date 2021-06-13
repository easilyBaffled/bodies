import { configureStore } from '@reduxjs/toolkit';

import game from '../features/game/game.slice';
import pickAKart from '../features/pages/pickAKart/pickAKart.slice';
import draft from '../features/pages/draft/draft.slice';
import build from '../features/pages/build/build.slice';
import race from '../features/pages/race/race.slice';


export default configureStore({
    reducer: {
        build,
        draft,
        game,
        pickAKart,
        race
    }
});
