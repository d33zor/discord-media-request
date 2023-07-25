import { useContext } from 'react';
import styled from 'styled-components';
import { IndexContext } from '../contexts/IndexContext';
import discordLogo from './../assets/discord_logo.png';
import formatDate from '../utils/formatDate';

const Request = ({ message, msgIndex }) => {
  const { index, setIndex } = useContext(IndexContext);
  const handleClick = (index) => {
    setIndex(index);
    localStorage.setItem('video_index', index);
  };

  if (message.attachments.length > 0) {
    return (
      <Wrapper selected={index === msgIndex} onClick={() => handleClick(msgIndex)}>
        <Thumbnail src={discordLogo}></Thumbnail>
        <TitleWrapper>
          <Title>{message.attachments[0].filename}</Title>
          <RequestedBy selected={index === msgIndex}>
            requested by {message.author.username} on {formatDate(message.timestamp)}
          </RequestedBy>
        </TitleWrapper>
        <Index selected={index === msgIndex}>#{msgIndex + 1}</Index>
      </Wrapper>
    );
  }
  if (message.embeds.length > 0) {
    return (
      <Wrapper selected={index === msgIndex} onClick={() => handleClick(msgIndex)}>
        <Thumbnail
          src={
            message.embeds[0]?.thumbnail?.url &&
            !message.embeds[0]?.thumbnail?.url.includes('tiktokcdn')
              ? message.embeds[0]?.thumbnail?.url
              : discordLogo
          }
        />
        <TitleWrapper>
          <Title>
            {message.embeds.length > 0 && message.embeds[0].title
              ? message.embeds[0].title
              : message.embeds.length > 0
              ? 'Untitled'
              : ''}
          </Title>
          <RequestedBy selected={index === msgIndex}>
            requested by {message.author.username} on {formatDate(message.timestamp)}
          </RequestedBy>
        </TitleWrapper>
        <Index selected={index === msgIndex}>#{msgIndex + 1}</Index>
      </Wrapper>
    );
  }
};

export default Request;

const Wrapper = styled.div`
  display: flex;
  gap: 1rem;
  transition: background-color 0.3s;
  background-color: ${({ selected }) => (selected ? '#1971c2' : '#181e29')};
  border-radius: 0.5rem;
  overflow: hidden;
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
  color: ${({ selected }) => (selected ? 'white' : '#6a6f76')};
`;
