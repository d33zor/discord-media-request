import { useContext } from 'react';
import styled from 'styled-components';
import { IndexContext } from '../../contexts/IndexContext';
import tiktokLogo from '../../assets/tiktok_logo.png';
import mp4Logo from '../../assets/mp4_logo.png';
import formatDate from '../../utils/formatDate';

const Request = ({ message, msgIndex, queueVisible }) => {
  const { index, setIndex } = useContext(IndexContext);
  const isAttachment = message?.attachments?.length > 0;

  return (
    <Wrapper selected={index === msgIndex} onClick={() => setIndex(msgIndex)}>
      <Thumbnail
        src={
          isAttachment
            ? `${message.attachments[0].proxy_url}?format=jpeg&width=${message.attachments[0].width}&height=${message.attachments[0].height}`
            : message.embeds[0]?.thumbnail?.url.includes('tiktokcdn')
            ? tiktokLogo
            : message.embeds[0]?.thumbnail?.url
            ? message.embeds[0]?.thumbnail?.url
            : message.embeds[0]?.video?.proxy_url.startsWith('https://media.discordapp.net/')
            ? `${message.embeds[0].video.proxy_url}?format=jpeg&width=${message.embeds[0].video.width}&height=${message.embeds[0].video.height}`
            : mp4Logo
        }
        alt={isAttachment ? message.attachments[0].filename : message.embeds[0].title}
      ></Thumbnail>
      {queueVisible && (
        <>
          <TitleWrapper>
            <Title>
              {isAttachment
                ? message.attachments[0].filename
                : message.embeds.length > 0 && message.embeds[0].title
                ? message.embeds[0].title
                : message.embeds.length > 0
                ? 'Untitled'
                : ''}
            </Title>
            <RequestedBy selected={index === msgIndex}>
              requested by {message.author.username} on {formatDate(message.timestamp)}
            </RequestedBy>
          </TitleWrapper>
          <Index $queueVisible={queueVisible} selected={index === msgIndex}>
            #{msgIndex + 1}
          </Index>
        </>
      )}
    </Wrapper>
  );
};

export default Request;

const Wrapper = styled.div`
  display: flex;
  gap: 1rem;
  transition: background-color 0.3s;
  background-color: ${({ selected }) => (selected ? '#1971c2' : '#181e29')};
  background-image: ${({ selected }) =>
    selected ? 'linear-gradient(45deg, #3b5bdb 0%, #0c8599 100%);' : 'none'};
  border-radius: 0.5rem;
  cursor: pointer;
  position: relative;
`;
const Thumbnail = styled.img`
  object-fit: contain;
  width: 7rem;
  height: 5rem;
  background-size: cover;
  background: black;
`;
const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 10rem;
  flex: 1;
  justify-content: center;
`;
const Title = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: bold;
`;
const RequestedBy = styled.div`
  font-size: 0.75rem;
  color: ${({ selected }) => (selected ? 'white' : '#6a6f76')};
`;
const Index = styled.div`
  position: absolute;
  right: 0.5rem;
  bottom: 0.3rem;
  font-size: 0.75rem;
  color: ${({ selected, $queueVisible }) => (selected || !$queueVisible ? 'white' : '#6a6f76')};
`;
