import { addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
addRxPlugin(RxDBDevModePlugin);
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
addRxPlugin(RxDBUpdatePlugin);
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { daySchema } from '../schema/day-schema';

const timerDatabase = await createRxDatabase({
  name: 'timerdatabase',
  storage: getRxStorageDexie(),
});
await timerDatabase.addCollections({
  days: {
    schema: daySchema,
  },
});

export { timerDatabase };
