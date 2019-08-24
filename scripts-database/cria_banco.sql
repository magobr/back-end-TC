CREATE DATABASE	logicGamesTc;

USE logicGamesTc;

CREATE TABLE usuario(
	id_usuario int auto_increment not null,
	id_jogador int not null,
	nome_usuario varchar(50) not null,
	email_usuario varchar(25) not null,
	apelido_jogador varchar(50) not null,
	dataNascimento_usuario date not null,
	senha_usuario varchar(256) not null,
	primary key(id_usuario)
);

CREATE TABLE usuario_dados(
	id_jogador int auto_increment not null,
	fase_jogador int not null,
	blocos_jogador int not null,
	retries_jogador int not null,
	passos_jogador int not null,
	pontuação_jogador int not null,
	primary key(id_jogador)
);

CREATE TABLE nivel_jogo(
	nivel_jogo int,
	primary key (nivel_jogo)
);

ALTER TABLE usuario ADD CONSTRAINT FOREIGN KEY (id_jogador) REFERENCES usuario_dados(id_jogador);
ALTER TABLE usuario_dados ADD CONSTRAINT FOREIGN KEY (id_jogador) REFERENCES nivel_jogo(nivel_jogo);


DELIMITER $$
CREATE FUNCTION autoInc()
    RETURNS INT(10)
    BEGIN
        DECLARE getCount INT(10);

        SET getCount = (
            SELECT COUNT(id_jogador)
            FROM usuario) + 1;

        RETURN getCount;
    END$$
DELIMITER ;

