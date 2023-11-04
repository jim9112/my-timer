/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
import Alpine from 'alpinejs';
import {
  addRxPlugin,
  createRxDatabase,
} from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
addRxPlugin(RxDBDevModePlugin);
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
addRxPlugin(RxDBUpdatePlugin);
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { daySchema } from './schema/day-schema';
import { getDateString } from './helpers/dates';
import './index.css';
// ****** To Do: start removing buisness logic from render module ********
// Create Database
const timerDatabase = await createRxDatabase({
  name: 'timerdatabase',
  storage: getRxStorageDexie(),
});
await timerDatabase.addCollections({
  days: {
    schema: daySchema,
  },
});
const today = getDateString();
const startingData = await timerDatabase.days.findOne(today).exec();
 document.addEventListener('alpine:init', () => {
   Alpine.data('timeData', () => ({
     id: startingData?._data?.id || '',
     dayStart: startingData?._data?.dayStart || 0,
     lastBlock: startingData?._data?.lastBlock || 0,
     dayStarted: startingData?._data?.dayStarted || false,
     todaysBlocks: [],
     async startDay() {
       this.dayStart = Date.now();
       this.dayStarted = true;
       this.id = getDateString();
       const foundDocument = await timerDatabase.days.findOne(this.id).exec();
       if (!foundDocument) {
         await timerDatabase.days.insert({
           id: this.id,
           datStart: this.dayStart,
           dayStarted: this.dayStarted,
         });
       }
     },
     async recordBlock() {
       const endTime = Date.now();
       const startTime = this.lastBlock !== 0 ? this.lastBlock : this.dayStart;
       const blockNum = this.todaysBlocks.length + 1;
       this.todaysBlocks.push({
         title: `Block ${blockNum}`,
         start: startTime,
         end: endTime,
         totalseconds: Math.round((endTime - startTime) / 1000),
       });
       this.lastBlock = endTime;
       const foundDocument = await timerDatabase.days.findOne(this.id).exec();
       await foundDocument?.update({
          $set: {
            lastBlock: this.lastBlock,
            todaysBlocks: this.todaysBlocks,
          },
       });
     },
     outputTime(timeElapsed: number) {
       return new Date(timeElapsed * 1000).toISOString().substring(11, 19);
     },
     resetDay() {
       this.dayStart = 0;
       this.lastBlock = 0;
       this.dayStarted = false;
       this.todaysBlocks = [];
     },
   }));
 });   
 Alpine.start();