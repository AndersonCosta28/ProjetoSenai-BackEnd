const mysql = require('mysql')

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: 'projetosenai',
  port: 3360
});
/*
drop trigger if exists delete_end;
DELIMITER $$
create trigger delete_end before delete
on pessoa for each row 
begin 
	delete from endereco where old.idpessoa = pessoa_id;
end
$$
 */
module.exports = con;