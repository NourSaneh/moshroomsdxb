import * as migration_20261124_144334_initial from './20261124_144334_initial';
import * as migration_20261124_195753_intro_text from './20261124_195753_intro_text';

export const migrations = [
  {
    up: migration_20261124_144334_initial.up,
    down: migration_20261124_144334_initial.down,
    name: '20261124_144334_initial',
  },
  {
    up: migration_20261124_195753_intro_text.up,
    down: migration_20261124_195753_intro_text.down,
    name: '20261124_195753_intro_text'
  },
];
