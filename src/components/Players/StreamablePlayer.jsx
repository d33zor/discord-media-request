import { useEffect, useState } from 'react';
import styled from 'styled-components';
import NativePlayer from './NativePlayer';
import axios from 'axios';
import { Loader } from '@mantine/core';
import VideoErrorSVG from '../VideoErrorSVG';

const StreamablePlayer = ({ url }) => {
  const [directUrl, setDirectUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const autoplay = localStorage.getItem('autoplay') === 'true' ? true : false;

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const fetchVideo = async () => {
      try {
        const { data } = await axios(`https://corsproxy.io/?${url}`, { signal });
        const html = new DOMParser().parseFromString(data, 'text/html');
        setDirectUrl(html.querySelector('video').src);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setIsLoading(false);
      }
    };
    fetchVideo();

    return () => controller.abort();
  }, [url]);

  return (
    <>
      {!isLoading && !error ? (
        <NativePlayer autoplay={autoplay} url={directUrl} />
      ) : !isLoading && error ? (
        <Wrapper>
          <VideoErrorSVG /> This Streamable video is no longer available.
        </Wrapper>
      ) : (
        <Wrapper>
          <Loader size='sm' />
        </Wrapper>
      )}
    </>
  );
};

export default StreamablePlayer;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.25rem;
`;
