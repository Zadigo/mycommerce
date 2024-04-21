import axios from 'axios'

const client = axios.create({
  baseURL: 'http://example.com',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 10000
})

export {
  client
}
