import coincident from 'coincident';
import { Database, Sqlite3Static, default as sqlite3InitModule } from '@sqlite.org/sqlite-wasm';

const worker = coincident(self) as any;

let sqlite3: Sqlite3Static;
let db: Database;

worker.init = async () => {
    sqlite3 = await sqlite3InitModule({
        locateFile: () => './sqlite3.wasm'
    })
}

worker.open = (filename = ':memory') => {
    // TODO - need to look at how the built in worker code does this
    // @see node_modules/sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3-bundler-friendly.mjs#L11738
    let vfs;
    if(sqlite3.capi.sqlite3_vfs_find('opfs')) {
        vfs = 'opfs';
    }
    db = new sqlite3.oo1.DB(filename, 'ct', vfs);
}

worker.exec = (command: string) => {
    // TODO - implement (should we implement a generic method like this or make user case specific methods?)
    if(!db) {
        return; // hmm... what to do here - need a way to send error notifications
    }
}

worker.close = () => {
    // TODO - need to look at how the built in worker code does this
    // @see node_modules/sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3-bundler-friendly.mjs#L11787
    db?.close();
}

