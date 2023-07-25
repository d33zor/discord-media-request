import styled from 'styled-components';

const YoutubePlayer = ({ url }) => {
  return (
    <Wrapper>
      <iframe
        src={`${url}?autoplay=1`}
        width='100%'
        height='100%'
        allowFullScreen
        frameBorder={0}
      ></iframe>
    </Wrapper>
  );
};

export default YoutubePlayer;
const Wrapper = styled.div`
  width: 100%;
  height: 90%;
  position: relative;
`;
