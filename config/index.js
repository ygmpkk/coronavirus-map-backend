module.exports = {
    paths: {
        dbmodels: 'models',
        logroot: './logs',
        webroot: './',
        uploads: './public/uploads'
    },
    models:[],
    dbs: {
        defaults: {
            "name": "ncovdb", "user": "pgncov", "pass": "plAXL1S%5E", "host": "127.0.0.1", "dialect": "postgres",
            "port":"5432", "pool": { "max": 5, "min": 0, "acquire": 30000, "idel": 10000 }
        }
    }
}
