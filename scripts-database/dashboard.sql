select
	usuario.apelido_jogador,
	usuario_dados.xp_jogador,
	usuario_dados.fase_jogador,
	usuario_dados.falha_jogador

from 
	usuario
inner join 
	usuario_dados
on 
	usuario.id_jogador = usuario_dados.id_jogador;


select

	usuario_dados.blocos_jogador,
	usuario_dados.retries_jogador,
	usuario_dados.passos_jogador,
	usuario_dados.pontuação_jogador

from 
	usuario_dados
inner join 
	nivel_jogo
on 
	nivel_jogo.nivel_jogo = {{nível específico}};
