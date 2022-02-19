import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { useEffect, useState } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';
import P from 'prop-types';

const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMzNjQ4MCwiZXhwIjoxOTU4OTEyNDgwfQ.kzEKBCTOB_MIc-mgL8Tkf6xWxV_1GRbGFzktLoQspnM';
const SUPABASE_URL = 'https://fivmjsazshobwiknzgay.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionaMensagem) {
  return supabaseClient
    .from('mensagens')
    .on('INSERT', (response) => {
      adicionaMensagem(response.new);
    })
    .subscribe();
}

export default function ChatPage() {
  const [mensagem, setMensagem] = useState('');
  const [listaDeMensagens, setListaDeMensagens] = useState([]);
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query;

  useEffect(() => {
    supabaseClient
      .from('mensagens')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        setListaDeMensagens(
          data.map((object) => {
            return { ...object, created_at: new Intl.DateTimeFormat('pt-BR').format(new Date(object.created_at)) };
          }),
        );
      });
    escutaMensagensEmTempoReal((novaMensagem) =>
      setListaDeMensagens((currentValue) => [novaMensagem, ...currentValue]),
    );
  }, []);

  const handleNovaMensagem = (novaMensagem) => {
    const mensagem = {
      texto: novaMensagem,
      de: usuarioLogado.userName,
    };

    supabaseClient
      .from('mensagens')
      .insert([mensagem])
      .then(() => {
        // setListaDeMensagens([data[0], ...listaDeMensagens])
      });

    setMensagem('');
  };

  return (
    <>
      <Box
        styleSheet={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage:
            'url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg) ',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundBlendMode: 'multiply',
          color: appConfig.theme.colors.neutrals['000'],
        }}
      >
        <Box
          styleSheet={{
            display: 'flex',
            flexDirection: 'column',
            Width: '95%',
            maxHeight: '95vh',
            maxWidth: '95%',
            height: '100%',
            backgroundColor: appConfig.theme.colors.neutrals[700],
            padding: '32px',
            borderRadius: '5px',
          }}
        >
          {/* Header */}
          <Box
            styleSheet={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <Text variant="heading5">Chat</Text>
            <Button variant="tertiary" colorVariant="neutral" label="Logout" href="/" />
          </Box>

          {/* Chat Area */}
          <Box
            styleSheet={{
              height: '90%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: appConfig.theme.colors.neutrals[600],
              borderRadius: '5px',
              padding: '16px',
            }}
          >
            {/* Mensage list */}
            <MessageList mensagens={listaDeMensagens} />

            {/* Form Box */}
            <Box
              styleSheet={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TextField
                value={mensagem}
                onChange={(event) => setMensagem(event.target.value)}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleNovaMensagem(mensagem);
                  }
                }}
                placeholder="Insira sua mensagem aqui"
                styleSheet={{
                  width: '100%',
                  border: '0',
                  resize: 'none',
                  borderRadius: '5px',
                  padding: '6px 8px',
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                  marginRight: '12px',
                  color: appConfig.theme.colors.neutrals[200],
                }}
                type="textarea"
              ></TextField>
              <ButtonSendSticker
                onStickerClick={(sticker) => {
                  handleNovaMensagem(`:sticker:${sticker}`);
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

const MessageList = ({ mensagens }) => {
  return (
    <Box
      tag="ul"
      styleSheet={{
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: '1',
        marginBottom: '16px',
        overflow: 'auto',
      }}
    >
      {/* mensagens */}
      {mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              marginBottom: '12px',
              borderRadius: '5px',
              padding: '6px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px',
              }}
            >
              <Image
                src={`https://github.com/${mensagem.de}.png`}
                styleSheet={{
                  marginBottom: '4px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                }}
              ></Image>
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                tag="span"
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals[300],
                  marginBottom: '8px',
                }}
              >
                {mensagem.created_at}
              </Text>
            </Box>
            {mensagem.texto.startsWith(':sticker:') ? (
              <Image
                src={mensagem.texto.replace(':sticker:', '')}
                styleSheet={{
                  maxWidth: '200px',
                }}
              />
            ) : (
              mensagem.texto
            )}
          </Text>
        );
      })}
    </Box>
  );
};

MessageList.propTypes = {
  mensagens: P.array,
};
