import assert from 'node:assert'
import fs from 'node:fs'
import Surreal from 'surrealdb'

const endpoint = process.env.SURREAL_ENDPOINT
const namespace = process.env.SURREAL_NAMESPACE
const database = process.env.SURREAL_DATABASE
const username = process.env.SURREAL_ROOT_USERNAME
const password = process.env.SURREAL_ROOT_PASSWORD

const db = new Surreal()
await db.connect(endpoint, { versionCheck: false })

if (database || namespace) {
  await db.use({
    namespace: namespace,
    database: database,
  })
}

if (username || password) {
  assert(username, 'Username needs to be defined when password is set')
  assert(password, 'Password needs to be defined when username is set')

  await db.signin({
    username: username,
    password: password,
  })
}

await db.query(fs.readFileSync('./schema.surql', 'utf8'))
console.log(`>>> schema loaded`)

const processes = Array(100)
  .keys()
  .map((key) => async () => {
    console.log(`creating book ${key}`)

    try {
      const [doc] = await db.query(`CREATE ONLY book CONTENT $book RETURN id`, {
        book: {
          description: 'free palestine',
          title: 'free palestine',
        },
      })

      console.log(`created book`, doc)
      return doc
    } catch (e) {
      console.log(`failed to create book`, key)
      console.error(e)

      throw e
    }
  })
  .map((fn) => fn())

const output = await Promise.allSettled(processes)

console.log(`${output.length} items processed`)
console.log(`\t* ${output.filter((result) => result.status === 'fulfilled').length}\t succeeded`)
console.log(`\t* ${output.filter((result) => result.status === 'rejected').length}\t failed`)

await db.close()
