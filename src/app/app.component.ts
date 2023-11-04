import { Component, OnDestroy, OnInit } from '@angular/core';
import coincident from 'coincident';

export type SqliteWorker = { init: () => void}

@Component({
  selector: 'app-root',
  template: ``,
  styles: []
})
export class AppComponent implements OnInit, OnDestroy {

  #worker!: any // don't like this
  async ngOnInit() {
    this.#worker = coincident(new Worker(new URL('sqlite.worker', import.meta.url)))
    await this.#worker.init();
    await this.#worker.open('/mydb.sqlite3');
    const result = await this.#worker.exec();
    console.log('RESULT: ', result)
  }

  ngOnDestroy(): void {
    this.#worker.close();
  }
}
