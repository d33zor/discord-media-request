import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { Suspense, lazy, useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import MainPageSVG from './components/MainPageSVG';
const PlayerPage = lazy(() => import('./pages/PlayerPage'));
const MainPage = lazy(() => import('./pages/MainPage'));
const GetStartedPage = lazy(() => import('./pages/GetStartedPage'));
import bgImg from './assets/login_page_bg.png';
import DevLogo from './components/DevLogo';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';

const SharedLayout = ({ children }) => {
  const data = JSON.parse(localStorage.getItem('api_data'));
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.token && data?.channel) {
      navigate('/queue');
    }
  }, []);

  return (
    <>
      {!data && (
        <Background $bgImg={bgImg}>
          <AnimatePresence>
            <MainWrapper>{children}</MainWrapper>
          </AnimatePresence>
          <SVGWrapper>
            <MainPageSVG />
          </SVGWrapper>

          <LogoWrapper>
            <a
              href='https://d33zor.dev/'
              style={{ display: 'flex' }}
              target='_blank'
              rel='noopener noreferrer'
            >
              <DevLogo />
            </a>
          </LogoWrapper>
        </Background>
      )}
    </>
  );
};

function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        components: {
          Button: {
            defaultProps: {
              variant: 'gradient',
              gradient: { from: 'indigo', to: 'cyan' },
            },
          },
          ActionIcon: {
            defaultProps: {
              variant: 'gradient',
              gradient: { from: 'indigo', to: 'cyan' },
            },
          },
        },
        colorScheme: 'dark',
        colors: {
          dark: [
            '#d5d7e0',
            '#acaebf',
            '#8c8fa3',
            '#666980',
            '#4d4f66',
            '#34354a',
            '#2b2c3d',
            '#0f131a',
            '#0c0d21',
            '#01010a',
          ],
        },
      }}
    >
      <BrowserRouter>
        <Suspense fallback={<SharedLayout />}>
          <Routes>
            <Route
              path='/'
              element={
                <SharedLayout>
                  <MainPage />
                </SharedLayout>
              }
            />
            <Route
              path='/get-started'
              element={
                <SharedLayout>
                  <GetStartedPage />
                </SharedLayout>
              }
            />

            <Route path='/queue' element={<PlayerPage />} />
            <Route path='/*' element={<Navigate to='/' replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;

const Background = styled.div`
  height: 100%;
  background-image: linear-gradient(to right, rgb(15, 19, 26) 50%, rgba(15, 19, 26, 0.7)),
    url(${({ $bgImg }) => $bgImg});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 100%;
  display: flex;
`;

const MainWrapper = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 5rem;
  gap: 3rem;
`;

const LogoWrapper = styled.div`
  position: absolute;
  right: 1rem;
  bottom: 1rem;
`;

const SVGWrapper = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
