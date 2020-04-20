import http from 'http'
import Gun, { SEA } from 'gun'

let server, peer1, peer2

beforeEach(() => {
  server = http.createServer().listen(9876)
  Gun({web: server, radisk: false})
  peer1 = Gun('http://localhost:9876/gun')
  peer2 = Gun('http://localhost:9876/gun')
})

afterEach(async () => {
  await server.close()
})

it('communicates', done => {
  peer1.get('example').put({ message: 'hello'})
  peer2.get('example').get('message').once(message => {
    expect(message).toEqual('hello')
    done()
  })
})

it('encrypts', async () => {
  const user1 = await SEA.pair()
  const user2 = await SEA.pair()
  const key1 = await SEA.secret(user2.epub, user1)
  const key2 = await SEA.secret(user1.epub, user2)
  const encrypted = await SEA.encrypt('hello', key1)
  const decrypted = await SEA.decrypt(encrypted, key2)
  expect(decrypted).toBe('hello')
})
