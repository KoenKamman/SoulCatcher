import fs from 'fs';
import path from 'path';
import { app } from 'electron';

export class Store<T> {
    private path: string;
    public data: T;

    public constructor(filename: string, defaults: T) {
        this.path = path.join(app.getPath('userData'), filename + '.json');
        this.data = this.parseFile(this.path, defaults);
    }

    public get(): T {
        return JSON.parse(JSON.stringify(this.data));
    }

    public set(data: T): void {
        try {
            const stringData = JSON.stringify(data);
            fs.writeFileSync(this.path, stringData);
            this.data = JSON.parse(stringData);
        } catch (e) {
            throw e;
        }
    }

    private parseFile(filePath: string, defaults: T): T {
        try {
            return JSON.parse(fs.readFileSync(filePath).toString());
        } catch (e) {
            return defaults;
        }
    }
}
