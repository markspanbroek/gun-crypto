import http from 'http'
import Gun from 'gun'

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
