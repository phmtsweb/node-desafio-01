import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)


export class Database {
  #database = {}

  constructor () {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  insert (table, data) {
    const dataWithId = {
      id: randomUUID(),
      ...data
    }

    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(dataWithId)
    } else {
      this.#database[table] = [dataWithId]
    }
    this.#persist()
    return dataWithId
  }

  #persist () {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
      .then(() => {})
      .catch(() => {})
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].includes(value);
        });
      });
    }
    return data;
  }

  selectByid(table, id) {
    if (this.#database[table]) {
      return this.#database[table].find(data => data.id === id);
    }
    return undefined;
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {
        id,
        ...data
      }
      this.#persist();
    }
  }
}
