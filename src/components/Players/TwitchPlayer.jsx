import styled from 'styled-components';

const TwitchPlayer = ({ url }) => {
  return (
    <Wrapper>
      <iframe
        src={url.replace('&parent=meta.tag', `&parent=${location.hostname}&autoplay=true`)}
        width='100%'
        height='100%'
        allowFullScreen
        frameBorder={0}
        title='Player'
      />
    </Wrapper>
  );
};

export default TwitchPlayer;

const Wrapper = styled.div`
  flex: 1;
`;
