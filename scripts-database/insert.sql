insert into usuario_dados
(fase_jogador, blocos_jogador, retries_jogador, passos_jogador, pontuação_jogador)
values
(0, 0, 0);

insert into usuario (id_jogador, nome_usuario, email_usuario, apelido_jogador, dataNascimento_usuario, senha_usuario) values (`logicGamesTc`.`autoInc`(), 'nome_usuario', 'email_usuario', 'apelido_jogador', '1998-09-05', md5('senha_usuario'));

insert into nivel_jogo (nivel_jogo) values (1);
