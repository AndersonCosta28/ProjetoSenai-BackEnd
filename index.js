const express = require('express')
const app = express()
const cors = require('cors');
const { Pool, Client, Query } = require('pg')
const pool = new Pool({
    user: 'sbqzwjcs',
    host: 'kesavan.db.elephantsql.com',
    database: 'sbqzwjcs',
    password: 'fVjOb8DncYLD2JkUWpmtf3SY9K0vSG19'
})
pool
    .connect()
    .then(() => console.log('connected'))
    .catch(err => console.error('connection error', err.stack))

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (request, response) => {
    response.send('hello world')
})

app.get('/GetNome', (request, response) => {
    console.log(request.query.nome)

    pool.query(`SELECT * FROM pessoa left join endereco on endereco.pessoa_id = pessoa.idpessoa where nome like '%${String(request.query.nome).toUpperCase()}%' order by idpessoa asc`)
        .then(result => response.send(result.rows))
        .catch(err => { console.log(err); throw err })
})

app.get('/dados', (request, response, next) => {
    const id = request.query

    console.log(request.params)
    if (JSON.stringify(id) == "{}") {
        pool.query("SELECT * FROM pessoa as p join endereco as e on e.pessoa_id = p.idpessoa order by p.idpessoa asc")
            .then(result => response.send(result.rows))
            .catch(err => { console.log(err); throw err })
    }
    //else if(request.query.nome){}
    else {
        pool.query(`SELECT * FROM pessoa left join endereco on endereco.pessoa_id = pessoa.idpessoa where idpessoa = ${request.query.idpessoa} order by idpessoa asc`)
            .then(result => response.send(result.rows))
            .catch(err => { console.log(err); throw err })
    }
})

app.get('/dados/:nome', (request, response) => {
    console.log(request.query.nome)
    response.end()
})

app.post('/dados', (request, response) => {
    console.log(request.body)
    const req = request.body;
    const { endereco } = req
    const sql = `insert into pessoa (nome,sobrenome,telefone,email) values (upper('${req.nome}'), upper('${req.sobrenome}'), '${req.telefone}', '${req.email}') RETURNING idpessoa;`;
    pool.query(sql)
        .then(res => {
            const [{ idpessoa }] = res.rows
            console.log(idpessoa)
            const sql2 = `INSERT INTO endereco (cep, logradouro, numero, bairro, localidade, complemento,uf, pessoa_id) VALUES ('${String(endereco.cep).replace('-', '')}', '${endereco.logradouro}', '${String(endereco.numero).replace(undefined, '')}', '${endereco.bairro}', '${endereco.localidade}', '${endereco.complemento}', '${endereco.uf}', ${idpessoa});`
            pool.query(sql2)
                .then(res => { console.log("Deu Certo"); response.send(true) })
                .catch(e => { console.log(e); response.send(false) })
        })
        .catch(e => { console.log(sql); console.log(e); response.send(false) })
})

app.put('/dados', (request, response) => {
    const { endereco } = request.body
    const sql1 = `UPDATE PESSOA SET NOME = '${request.body.nome}', SOBRENOME = '${request.body.sobrenome}', TELEFONE = '${request.body.telefone}', EMAIL= '${request.body.email}' WHERE idpessoa = ${request.body.idpessoa}`
    const sql2 = `UPDATE ENDERECO SET cep = '${String(endereco.cep).replace('-', '')}', logradouro = '${endereco.logradouro}', numero = '${String(endereco.numero).replace(undefined, '')}', bairro = '${endereco.bairro}', localidade =  '${endereco.localidade}', complemento = '${endereco.complemento}',uf = '${endereco.uf}' where idendereco = ${endereco.idendereco}`
    pool.query(sql1)
        .then(result => {
            if (!!result.rowCount == true)
                pool.query(sql2)
                    .then(result => { console.log("Deu Certo"); response.send(true) })
                    .catch(e => { console.log(sql2); console.log(e); response.send(false) })
        })
        .catch(e => { console.log(sql1); console.log(e); response.send(false) })
})

app.delete('/dados', (request, response) => {
    console.log(JSON.stringify(request.query))
    const sql = `delete from pessoa where idpessoa = ${request.query.idpessoa}`
    pool.query(sql)
        .then(res => { console.log("Deu Certo"); response.send(true) })
        .catch(e => { console.log(sql); console.log(e); response.send(false) })
})

app.post('/evento', (request, response) => { //replace('${req.Dia}', '/', '-')
    const req = request.body;
    console.log(req)
    const sql = `insert into evento (banda,datahora,ingresso_inteira,ingresso_meia) values (Upper('${req.banda}'), '${req.datahora}' , ${String(req.valor_inteira).replace(',', '.')}, ${String(req.valor_meia).replace(',', '.')})`;
    pool.query(sql)
        .then(res => { console.log("Deu Certo"); response.send(true) })
        .catch(e => { console.log(sql); console.log(e); response.send(false) })
})

app.get('/evento', (request, response,) => {
    const id = request.query

    console.log(request.params)
    if (JSON.stringify(id) == "{}") {
        pool.query("SELECT * FROM evento order by idevento asc")
            .then(result => { console.log(result.rows); response.send(result.rows) })
            .catch(err => { console.log(err); throw err })
    }
    else {
        const sql = `SELECT * FROM evento where idevento = ${request.query.idevento} order by idevento asc`;
        pool.query(sql)
            .then(result => response.send(result.rows))
            .catch(err => { console.log(sql);console.log(err); throw err })
    }
})

app.put('/evento', (request, response) => {
    const sql = `UPDATE EVENTO SET BANDA = '${request.body.banda}', datahora = '${request.body.datahora}', ingresso_inteira = '${request.body.valor_inteira}', ingresso_meia= '${request.body.valor_meia}' WHERE idevento = ${request.body.idevento}`
    pool.query(sql)
        .then(result => { console.log("Deu Certo"); response.send(true) })
        .catch(e => { console.log(sql); console.log(e); response.send(false) })
})

app.delete('/evento', (request, response) => {
    console.log(JSON.stringify(request.query))
    const sql = `delete from evento where idevento = ${request.query.idevento}`
    pool.query(sql)
        .then(res => { console.log("Deu Certo"); response.send(true) })
        .catch(e => { console.log(sql); console.log(e); response.send(false) })
})

app.post('/venda', (request, response) =>{
    const req = request.body;
    console.log(req)
    const sql = `INSERT INTO venda(pessoa_id, evento_id, valor_ingresso, tipo_ingresso) VALUES (${req.pessoa_id}, ${req.evento_id}, ${req.valor},'${req.sigla}');`;
    pool.query(sql)
        .then(res => { console.log("Deu Certo"); response.send(true) })
        .catch(e => { console.log(sql); console.log(e); response.send(false) })

})

app.get('/venda', (request, response) =>{
  const sql = `SELECT * FROM venda JOIN pessoa ON pessoa_id = idpessoa JOIN evento ON evento_id = idevento;`;
    pool.query(sql)
    .then(res => {console.log("vamo carai"); response.send(true) })
    .catch(e => {console.log(sql); console.log(e); response.send(false) })
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`))