create database LogicaGamesTC;

Use LogicaGamesTC;

create table professor(
	id_professor int auto_increment not null primary key,
	nome varchar(255) not null,
    credencial varchar(255) not null,
    email varchar(255),
	senha varchar(255) not null
);

create table usuario(
	id_usuario int auto_increment not null primary key,
	nome varchar(255) not null,
	email varchar(255) not null,
	idade int not null,
	professor varchar(255),
	senha varchar(255) not null,
	nivelAtual int,
	classificacao varchar(255)
);

create table niveis(
	id_nivel int auto_increment not null  primary key,
	id_usuario int not null,
	n_passos int,
	n_pontos int,
	n_blocos int,
	n_tentativas int,
	nivel int,
	resultadoDesempenho varchar(255)
);

Alter table niveis add constraint foreign key (id_usuario) references usuario(id_usuario);

insert into professor(nome, credencial, email, senha) values ('admin', 'admin', '', '@123');