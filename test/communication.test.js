import http from 'http'
import Gun from 'gun'

let server
let gun

beforeEach(() => {
  server = http.createServer().listen(9876)
  gun = Gun({web: server})
})

afterEach(async () => {
  await server.close()
})

it('communicates', done => {
  const peer1 = Gun('http://localhost:9876/gun')
  const peer2 = Gun('http://localhost:9876/gun')

  peer1.get('example').put({ message: 'hello'})
  peer2.get('example').get('message').once(message => {
    expect(message).toEqual('hello')
    done()
  })
})
