insert into usuario_dados
(xp_jogador, fase_jogador, falha_jogador)
values
(0, 0, 0);

insert into usuario 
(id_jogador, nome_usuario, email_usuario, apelido_jogador, dataNascimento_usuario, senha_usuario)
values
(auto, 'nome_usuario', 'email_usuario', 'apelido_jogador', 'dataNascimento_usuario', md5('senha_usuario'));
