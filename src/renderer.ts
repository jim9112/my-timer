import Alpine from 'alpinejs';
import { getDateString } from './helpers/dates';
import './index.css';
import { timerDatabase } from './helpers/db';
// ****** To Do: start removing buisness logic from render module ********
const today = getDateString();
// Check for current day in database
const startingData = await timerDatabase.days.findOne(today).exec();
// generate a starting bock array that doesn't have direct references to the database
const startingBlocks: object[] = [];
if (startingData?._data?.todaysBlocks) {
  startingData._data.todaysBlocks.forEach((block: any) => {
    startingBlocks.push({...block});
  });
}
 document.addEventListener('alpine:init', () => {
   Alpine.data('timeData', () => ({
     id: startingData?._data?.id || '',
     dayStart: startingData?._data?.dayStart || 0,
     lastBlock: startingData?._data?.lastBlock || 0,
     dayStarted: startingData?._data?.dayStarted || false,
     todaysBlocks: [...startingBlocks],
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
     async saveChanges() {
      const foundDocument = await timerDatabase.days.findOne(this.id).exec();
      await foundDocument?.update({
        $set: {
          todaysBlocks: this.todaysBlocks,
        },
      });
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