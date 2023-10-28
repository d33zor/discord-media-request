import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import NativePlayer from './NativePlayer';
import { Loader } from '@mantine/core';
import VideoErrorSVG from '../VideoErrorSVG';

const TiktokPlayer = ({ url, length }) => {
  const [directUrl, setDirectUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const autoplay = localStorage.getItem('autoplay') === 'true' ? true : false;

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const fetchDirectUrl = async () => {
      try {
        const response = await axios(`https://co.wuk.sh/api/json`, {
          method: 'POST',
          data: JSON.stringify({
            url: encodeURIComponent(url.split('&')[0].split('%')[0]),
            aFormat: 'mp4',
          }),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          signal,
        });
        setDirectUrl(response.data.url);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setIsLoading(false);
      }
    };
    fetchDirectUrl();

    return () => controller.abort();
  }, []);

  return (
    <Wrapper $isLoading={isLoading} $error={error}>
      {!isLoading && !error ? (
        <NativePlayer autoplay={autoplay} url={directUrl} length={length} />
      ) : isLoading ? (
        <TikTokWrapper>
          <Loader size='sm' />
          <div>
            If loading TikTok takes too long, check it manually:{' '}
            <a href={url} target='_blank' rel='noreferrer noopener'>
              link
            </a>
          </div>
        </TikTokWrapper>
      ) : error ? (
        <TikTokWrapper>
          <VideoErrorSVG />
          Cannot load TikTok, check it manually:
          <a href={url} target='_blank' rel='noreferrer noopener'>
            {url}
          </a>
        </TikTokWrapper>
      ) : null}
    </Wrapper>
  );
};

export default TiktokPlayer;

const Wrapper = styled.div`
  width: 100%;
  flex: 1;
  position: relative;
  display: flex;
  justify-content: ${({ $isLoading, $error }) => (!$isLoading && !$error ? 'initial' : 'center')};
  align-items: ${({ $isLoading, $error }) => (!$isLoading && !$error ? 'initial' : 'center')};
`;
const TikTokWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  font-weight: bold;
  font-size: 1.25rem;
`;
