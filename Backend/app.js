const express = require('express');
const config = require('config');
const cors= require('cors');
const pgPromise = require('pg-promise');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');

const cfgConnection = config.get('connection.string');
const pgp = pgPromise({}); // empty pgPromise instance
const psql = pgp(cfgConnection); // get connection to your PG db instance

//cors included to enable CORS requests
const app = express().use('*', cors());

// ошибка на сервере 
app.use(function(err, req, res, next) {
    res.status(err.status || 500).json(response.error(err.status || 500));
});

var jsonParser = bodyParser.json()

app.post('/users/add/:login/:password', async (req, res) => {

    const cs = new pgp.helpers.ColumnSet(['Login', 'Password'], {table: 'Users'});
    const values = [{Login: req.params.login, Password: req.params.password}];
    const query = pgp.helpers.insert(values, cs) + 'RETURNING "Id"';
    const userId = await psql.one(query);

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;    
    res.end(JSON.stringify(userId));
});

app.get('/users/profile/:accountId', async (req, res) => {
    
    const data = await psql.one({        
        text: 'SELECT "Login", "FirstName", "LastName", "City", "Phone", "BirthDate", "Gender" FROM "Users" WHERE "Id" = $1',
        values: [req.params.accountId]
    });

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;    
    res.end(JSON.stringify(data));
});

// авторизация
app.get('/users/login/:login/:password', async (req, res) => {
    
    const data = await psql.manyOrNone({        
        text: 'SELECT "Id"  FROM "Users" WHERE "Login" = $1 AND "Password" = $2',
        values: [req.params.login, req.params.password]
    });
    
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;    

    if (data.length == 0) {
        res.end(JSON.stringify({ error: true, message: "Логин и/или пароль не были распознаны"}));
        return;
    }

    const RSA_PRIVATE_KEY = 'my secret key';
    const jwtBearerToken = jwt.sign({ userId: data[0].Id }, RSA_PRIVATE_KEY);    
    res.end(JSON.stringify({ error: false, jwt: jwtBearerToken }))
});


app.put('/users/profile/:accountId', jsonParser, async (req, res) => {
    const userData = req.body
    const values = {
        FirstName: userData.firstName,
        LastName: userData.lastName,
        BirthDate: userData.birthDate,
        City: userData.city,
        Phone: userData.phone,
        Gender: userData.gender
    };    

    const condition = pgp.as.format(" WHERE \"Id\"=${id}", {id: +req.params.accountId })
    const query = pgp.helpers.update(values, null, "Users") + condition;
    await psql.none(query);

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;        
    res.end();
});

app.put('/users/password/:accountId', jsonParser, async (req, res) => {
    const userData = req.body    

    // смотрю, есть ли такой пользователь
    const result = await psql.one({
        text: 'SELECT COUNT(*) FROM "Users" WHERE "Id" = $1 AND "Password"= $2',
        values: [+req.params.accountId, userData.passwordCurrent]
    });

    console.log(result)

    if (result.count == 0) {
        // пользователя нет или пароль не подходит 
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;                
        res.end(JSON.stringify({"error" : "Пользователя не существует или пароль не подходит"}));   
        return 
    }

    const values = {
        Password: userData.newPassword,        
    };    

    // обновляю пароль пользователя
    const condition = pgp.as.format(" WHERE \"Id\"=${id} AND \"Password\"=${password}", {id: +req.params.accountId, password: userData.passwordCurrent })
    const query = pgp.helpers.update(values, null, "Users") + condition;
    console.log(query)
    await psql.none(query);    

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;        
    res.end();
});

const cfgPort = config.get('server.port')
app.listen(cfgPort, () => console.log(`Express Backend Server Now Running On localhost:${cfgPort}`));