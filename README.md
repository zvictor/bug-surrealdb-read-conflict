### Description

The use of `ANALYZER` in a schema [breaks the creation of new documents when such documents are being added in parallel](https://github.com/zvictor/bug-surrealdb-read-conflict).

### Steps to Reproduce:

1. Set the connection data:

```bash
export SURREAL_ENDPOINT=http://localhost:8000/rpc
export SURREAL_ROOT_USERNAME=root
export SURREAL_ROOT_PASSWORD=root
export SURREAL_NAMESPACE=bug
export SURREAL_DATABASE=bug
```

2. Run `node bug.js`

### Expected Output:

```haskell
>>> schema loaded
creating book 0
creating book 1
...

created book { id: RecordId { tb: 'book', id: '5qx3rjcdl5sxp1ayn9y6' } }
100 items processed
	* 100	 succeeded
	* 0 	 failed
```

### What we get instead:

```haskell
>>> schema loaded
creating book 0
creating book 1
...

created book { id: RecordId { tb: 'book', id: 'mvt0hcdse5rvjyglcs9e' } }
failed to create book 2
ResponseError: The query was not executed due to a failed transaction. There was a problem with a datastore transaction: Transaction read conflict
    at file:///tmp/bug-surrealdb-read-conflict/node_modules/.pnpm/surrealdb@1.0.1_tslib@2.7.0_typescript@5.6.2_ws@8.18.0/node_modules/surrealdb/dist/index.mjs:1:47656
    at Array.map (<anonymous>)
    at Surreal.query (file:///tmp/bug-surrealdb-read-conflict/node_modules/.pnpm/surrealdb@1.0.1_tslib@2.7.0_typescript@5.6.2_ws@8.18.0/node_modules/surrealdb/dist/index.mjs:1:47608)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async file:///tmp/bug-surrealdb-read-conflict/bug.js:40:21
    at async Promise.allSettled (index 2)
    at async file:///tmp/bug-surrealdb-read-conflict/bug.js:58:16
created book { id: RecordId { tb: 'book', id: '8gy327aqutbsqdfxtoln' } }
created book { id: RecordId { tb: 'book', id: 'z1eqphddwlm4km456dmn' } }
failed to create book 6
ResponseError: The query was not executed due to a failed transaction. There was a problem with a datastore transaction: Transaction read conflict
    at file:///tmp/bug-surrealdb-read-conflict/node_modules/.pnpm/surrealdb@1.0.1_tslib@2.7.0_typescript@5.6.2_ws@8.18.0/node_modules/surrealdb/dist/index.mjs:1:47656
    at Array.map (<anonymous>)
    at Surreal.query (file:///tmp/bug-surrealdb-read-conflict/node_modules/.pnpm/surrealdb@1.0.1_tslib@2.7.0_typescript@5.6.2_ws@8.18.0/node_modules/surrealdb/dist/index.mjs:1:47608)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async file:///tmp/bug-surrealdb-read-conflict/bug.js:40:21
    at async Promise.allSettled (index 6)
    at async file:///tmp/bug-surrealdb-read-conflict/bug.js:58:16
...

100 items processed
	* 29	 succeeded
	* 71	 failed
```