import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import { useRouter } from 'next/router';
import { useState } from 'react';
import P from 'prop-types';
import appConfig from '../config.json';

Titulo.propTypes = {
  children: P.node,
  tag: P.string,
};

const Titulo = ({ children, tag = 'h1' }) => {
  const Tag = tag;
  return (
    <>
      <Tag> {children} </Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.neutrals['000']};
          font-size: 24px;
          font-weight: 600;
        }
      `}</style>
    </>
  );
};

export default function Teste() {
  const [userName, setUserName] = useState('fvleal');
  const roteamento = useRouter();

  return (
    <>
      <Box
        styleSheet={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: appConfig.theme.colors.primary['500'],
          backgroundImage:
            'url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundBlendMode: 'multiply',
        }}
      >
        <Box
          styleSheet={{
            backgroundColor: appConfig.theme.colors.neutrals['700'],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            width: '100%',
            maxWidth: '700px',
            padding: '32px',
            borderRadius: '5px',
            margin: '16px',
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={(event) => {
              roteamento.push(`/chat?userName=${userName}`);
              event.preventDefault();
            }}
            styleSheet={{
              textAlign: 'center',
              marginBottom: '32px',
              display: 'flex',
              flexDirection: 'column',
              width: {
                xs: '100%',
                sm: '50%',
              },
            }}
          >
            <Titulo>Sistema de Chat</Titulo>
            <Text
              variant="body3"
              styleSheet={{
                color: appConfig.theme.colors.neutrals['300'],
                marginBottom: '32px',
              }}
            >
              Alura Imersão - Matrix
            </Text>
            <TextField
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[800],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
            <Button
              type="submit"
              label="Entrar"
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals['000'],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>

          {/* Imagem Box */}
          <Box
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: '1px solid',
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: '10px',
              padding: '16px',
              maxWidth: '200px',
              minHeight: '240px',
              flex: 1,
            }}
          >
            <Image
              styleSheet={{
                borderRadius: '50%',
                marginBottom: '16px',
              }}
              src={`https://github.com/${userName}.png`}
            />
            {userName && (
              <Text
                variant="body4"
                styleSheet={{
                  padding: '3px 10px',
                  color: appConfig.theme.colors.neutrals[100],
                  backgroundColor: appConfig.theme.colors.neutrals[900],
                  borderRadius: '1000px',
                }}
              >
                {userName}
              </Text>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
