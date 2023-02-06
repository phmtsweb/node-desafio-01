import { Database } from "./database.mjs";
import { buildRoutePath } from './utils/build-route-path.mjs'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    url: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query
      const query = search ? {
        title: search,
        description: search
      } : null
      const tasks = database.select('tasks', query)
      return res.setHeader('Content-type', 'application/json')
        .end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    url: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body
      if (!title || !description) {
        return res.writeHead(400).end()
      }

      const task = {
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    
      database.insert('tasks', task)
      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    url: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { title, description } = req.body
      if (!title || !description) {
        return res.writeHead(404).end()
      }

      const { id } = req.params;

      const task = database.selectByid('tasks', id)

      if (!task) {
        return res.writeHead(400).end(JSON.stringify({ message: 'Task not found' }))
      }

      const taskToUpdate = {
        ...task,
        title,
        description,
        updated_at: new Date()
      }

      database.update('tasks', id, taskToUpdate)
      return res.writeHead(200).end()
    }
  },
  {
    method: 'DELETE',
    url: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {

      const { id } = req.params;

      const task = database.selectByid('tasks',id)

      if (!task) {
        return res.writeHead(400).end(JSON.stringify({ message: 'Task not found' }))
      }

      database.delete('tasks', id)
      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    url: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {

      const { id } = req.params;

      const task = database.selectByid('tasks', id)

      if (!task) {
        return res.writeHead(400).end(JSON.stringify({ message: 'Task not found' }))
      }

      const taskToUpdate = {
        ...task,
        completed_at: new Date(),
        updated_at: new Date()
      }

      database.update('tasks', id, taskToUpdate)
      return res.end()
    }
  }
]