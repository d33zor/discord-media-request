import { Button } from '@mantine/core';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MainPage = () => {
  const data = JSON.parse(localStorage.getItem('api_data'));

  return (
    <>
      {!data && (
        <Wrapper
          initial={{ opacity: 0, y: '10px' }}
          animate={{ opacity: 1, y: '0' }}
          key='main-page'
          as={motion.div}
        >
          <Title>Discord Media Request</Title>
          <Description>
            With our Discord media player, you can watch all of your Discord media requests in one
            place. We support a wide variety of providers - YouTube, streamable, Twitch, TikTok,
            Imgur, nuuls and mp4 files. Our Discord media player is easy to use. See the queue of
            requests and skip them with one button!
          </Description>
          <Description>
            Click get started and start watching your Discord media requests in one place!
          </Description>
          <Link to='/get-started'>
            <Button size='lg'>Get started</Button>
          </Link>
        </Wrapper>
      )}
    </>
  );
};

export default MainPage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const Title = styled.div`
  font-size: 3rem;
  font-weight: bold;
`;

const Description = styled.div`
  font-size: 1.25rem;
  font-weight: 400;
`;
