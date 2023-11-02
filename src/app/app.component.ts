import { Component, OnInit, signal } from '@angular/core';
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

@Component({
  selector: 'app-root',
  template: `<h1>Main thread</h1>
  <pre class=main>{{mainOutput()}}</pre>
  <h1>Worker</h1>
  <pre class=worker>{{workerOutput()}}</pre>`,
  styles: []
})
export class AppComponent implements OnInit {

  protected mainOutput = signal('');
  protected workerOutput = signal('');

  #log = (...args: any[]) => {
    console.log(...args);
    this.mainOutput.update(value => value + `${args.join(' ')}\n`);
  }
  #error = (...args: any[]) => {
    console.error(...args);
    this.mainOutput.update(value => value + `${args.join(' ')}\n`);
  }
  
  #workerLog = (...args: any[]) => {
    console.log(...args);
    this.workerOutput.update(value => value + `${args.join(' ')}\n`);
  }
  #workerError = (...args: any[]) => {
    console.error(...args);
    this.workerOutput.update(value => value + `${args.join(' ')}\n`);
  }

  ngOnInit(): void {

    const start = (sqlite3: any) => {
      this.#log('Running SQLite3 version', sqlite3.version.libVersion);
      let db;
      if ('opfs' in sqlite3) {
        db = new sqlite3.oo1.OpfsDb('/mydb.sqlite3');
        this.#log('OPFS is available, created persisted database at', db.filename);
      } else {
        db = new sqlite3.oo1.DB('/mydb.sqlite3', 'ct');
        this.#log('OPFS is not available, created transient database', db.filename);
      }
      // Your SQLite code here.
    };
    
    this.#log('Loading and initializing SQLite3 module...');
    sqlite3InitModule({
      print: this.#log,
      printErr: this.#error,
      locateFile: () => '/sqlite3.wasm',
    }).then((sqlite3) => {
      this.#log('Done initializing. Running demo...');
      try {
        start(sqlite3);
      } catch (err: any) {
        this.#error(err.name, err.message);
      }
    });

    const worker = new Worker(new URL('./sqlite.worker', import.meta.url));

    worker.onmessage = ({data}) => {
      switch (data.type) {
        case 'log':
          this.#workerLog(data.payload)
          break;
        default:
          this.#workerError(data.payload)
      }
    }
  }
}
