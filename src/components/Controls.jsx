import { ActionIcon, Switch, Tooltip } from '@mantine/core';
import {
  IconHelpCircleFilled,
  IconLogout,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
} from '@tabler/icons-react';
import styled from 'styled-components';
import formatDate from '../utils/formatDate';

const Controls = ({ messages, index, autoplay, changeMedia, setAutoplay, open, queueVisible }) => {
  const { attachments, embeds } = messages[index];

  return (
    <Wrapper $queueVisible={queueVisible}>
      <Description>
        <Title>
          <A
            href={embeds.length > 0 ? embeds[0].url : attachments[0].url ? attachments[0].url : ''}
            target='_blank'
            rel='noreferrer noopener'
          >
            {embeds.length > 0 && embeds[0].title
              ? embeds[0].title
              : embeds.length > 0
              ? 'Untitled'
              : ''}
            {attachments.length > 0 && attachments[0].filename}
            {!queueVisible && (
              <>
                {' '}
                ({index + 1}/{messages.length})
              </>
            )}
          </A>
        </Title>
        <RequestInfo>
          requested by {messages[index]?.author?.username} on{' '}
          {formatDate(messages[index]?.timestamp)}
        </RequestInfo>
      </Description>
      <Buttons>
        <Tooltip
          label='Change or leave channel'
          multiline
          color='blue'
          withArrow
          transitionProps={{ transition: 'pop', duration: 300 }}
        >
          <ActionIcon
            variant='subtle'
            radius='xl'
            size='xl'
            onClick={open}
            aria-label='Leave this channel'
          >
            <IconLogout />
          </ActionIcon>
        </Tooltip>
        <Tooltip
          label='Autoplay is currently not working for Twitch player'
          multiline
          color='red'
          withArrow
          transitionProps={{ transition: 'pop', duration: 300 }}
        >
          <IconHelpCircleFilled />
        </Tooltip>
        <Switch
          label='Autoplay'
          labelPosition='left'
          size='md'
          defaultChecked={autoplay}
          onChange={() => {
            setAutoplay((prev) => {
              localStorage.setItem('autoplay', !prev);
              return !prev;
            });
          }}
        />
        <ActionIcon
          disabled={index === 0}
          size='xl'
          radius='xl'
          onClick={() => changeMedia('back')}
          aria-label='Previous video'
        >
          <IconPlayerSkipBackFilled />
        </ActionIcon>
        <ActionIcon
          disabled={index === messages.length - 1}
          size='xl'
          radius='xl'
          onClick={() => changeMedia('forward')}
          aria-label='Next video'
        >
          <IconPlayerSkipForwardFilled />
        </ActionIcon>
      </Buttons>
    </Wrapper>
  );
};

export default Controls;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ $queueVisible }) => ($queueVisible ? '2rem' : '1rem')};
  font-weight: bold;
  font-size: 1.25rem;
  justify-content: space-between;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Buttons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Title = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RequestInfo = styled.div`
  font-size: 0.75rem;
  color: #6a6f76;
  font-weight: 600;
`;
const A = styled.a`
  text-decoration: none;
  color: rgb(213, 215, 224);
  &:hover {
    text-decoration: underline;
  }
`;
