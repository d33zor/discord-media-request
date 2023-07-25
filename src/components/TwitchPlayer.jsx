import styled from 'styled-components';

const TwitchPlayer = ({ url }) => {
  return (
    <Wrapper>
      <iframe
        src={url.replace(
          '&parent=meta.tag',
          '&parent=discord-media-request.netlify.app&autoplay=true&muted=false'
        )}
        width='100%'
        height='100%'
        allowFullScreen
        frameBorder={0}
      ></iframe>
    </Wrapper>
  );
};

export default TwitchPlayer;

const Wrapper = styled.div`
  flex: 1;
`;
