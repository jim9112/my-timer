import { addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
addRxPlugin(RxDBDevModePlugin);
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
addRxPlugin(RxDBUpdatePlugin);
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { daySchema } from '../schema/day-schema';
import { getDateString } from './dates';


const today = getDateString();
let timerDatabase: any;
let startingData: any;
const startingBlocks: object[] = []

const getDocByDay = async (day: string) => {
  return await timerDatabase.days.findOne(day).exec();
}

const createDb = async () => {
  timerDatabase = await createRxDatabase({
    name: 'timerdatabase',
    storage: getRxStorageDexie(),
  });
  await timerDatabase.addCollections({
    days: {
      schema: daySchema,
    },
  });
  startingData = await getDocByDay(today);
  if (startingData?._data?.todaysBlocks) {
    startingData._data.todaysBlocks.forEach((block: object) => {
      startingBlocks.push({...block});
    });
  }
}
export { createDb, timerDatabase, startingData, startingBlocks, getDocByDay };
