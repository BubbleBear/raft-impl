export class Entry {
    term: number;

    command: string;

    constructor(term: number, command?: string) {
        this.term = term;
        this.command = command;
    }
}

export class Log {
    entries: Entry[] = [];

    append(term: number, command?: string) {
        this.entries.push(new Entry(term, command));
    }
}
