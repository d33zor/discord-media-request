import styled from 'styled-components';

const StreamablePlayer = ({ url }) => {
  const getEmbed = (link) => {
    return `https://streamable.com/e/${link.substring(
      link.indexOf('https://streamable.com/') + 23,
      link.length
    )}?autoplay=1&loop=0`;
  };
  const embedUrl = getEmbed(url);

  return (
    <Wrapper>
      <iframe
        src={embedUrl}
        width='100%'
        height='100%'
        allowFullScreen
        allow='autoplay'
        frameBorder={0}
      ></iframe>
    </Wrapper>
  );
};

export default StreamablePlayer;

const Wrapper = styled.div`
  width: 100%;
  flex: 1;
  position: relative;
`;
