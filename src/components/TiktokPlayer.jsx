import { TikTok } from 'react-tiktok';
import styled from 'styled-components';

const TiktokPlayer = ({ url }) => {
  return (
    <Wrapper>
      <TikTok url={url} frameBorder={0} />
    </Wrapper>
  );
};

export default TiktokPlayer;
const Wrapper = styled.div`
  width: 100%;
  flex: 1;
  position: relative;
  display: flex;
  place-items: center;
  place-content: center;
  font-size: 5rem;
`;
