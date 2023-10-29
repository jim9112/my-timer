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


import './index.css';
const testMe = () => {
    console.log('test me');
}
 document.addEventListener('alpine:init', () => {
    console.log('init');
   Alpine.data('timeData', () => ({
     dayStart: 0,
     lastBlock: 0,
     dayStarted: false,
     todaysBlocks: [],
     startDay() {
       this.dayStart = Date.now();
       this.dayStarted = true;
       console.log(this.dayStart);
     },
     recordBlock() {
       const endTime = Date.now();
       const startTime = this.lastBlock !== 0 ? this.lastBlock : this.dayStart;
       this.todaysBlocks.push({
         title: 'Block ' + (parseInt(this.todaysBlocks.length) + parseInt(1)),
         start: startTime,
         end: endTime,
         totalseconds: Math.round((endTime - startTime) / 1000),
       });
       this.lastBlock = endTime;
       console.log(this.todaysBlocks);
       testMe();
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
console.log('👋 This message is being logged by "renderer.ts", included via Vite');
