import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  getLatestMovies,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "../api";
import { styled } from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 500px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const NowPlayingSlider = styled.div`
  position: relative;
  top: -100px;
`;

const TopRatedtSlider = styled.div`
  position: relative;
  top: 150px;
`;

const UpcomingSlider = styled.div`
  position: relative;
  top: 400px;
`;

const MovieLatest = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  top: 650px;
  padding-bottom: 80px;
`;

const TitleWrap = styled.div`
  display: flex;
  align-items: center;
`;

const SliderTitle = styled.span`
  font-size: 30px;
`;

const NextButton = styled.button`
  margin-left: 20px;
  width: 40px;
  height: 26px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  color: red;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  padding: 0 10px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigText = styled.p`
  position: relative;
  padding: 2px;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const BigOverview = styled.p`
  position: relative;
  padding: 2px;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;
const offset = 6;

export default function Home() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  // const { data, isLoading } = useQuery<IGetMoviesResult>(
  //   ["movies", "nowplaying"],
  //   getNowPlayingMovies
  // );

  const useMultipleQuery = () => {
    const nowPlaying = useQuery(["nowPlaying"], getNowPlayingMovies);
    const latest = useQuery(["latest"], getLatestMovies);
    const topRated = useQuery(["topRated"], getTopRatedMovies);
    const upcoming = useQuery(["upcoming"], getUpcomingMovies);

    return [nowPlaying, topRated, upcoming, latest];
  };

  const [
    { data: nowPlayingData, isLoading: nowPlayingLoading },
    { data: topRatedData },
    { data: upcomingData },
    { data: latestData },
  ] = useMultipleQuery();

  const [nowplayingIndex, setNowplayingIndex] = useState(0);
  const [topRatedIndex, setTopRatedIndex] = useState(0);
  const [upcomingIndex, setUpcomingIndex] = useState(0);
  const [nowplayingLeaving, setNowplayingLeaving] = useState(false);
  const [topRatedLeaving, setTopRatedLeaving] = useState(false);
  const [upcomingLeaving, setUpcomingLeaving] = useState(false);
  const nowplayingIncraseIndex = () => {
    if (nowPlayingData) {
      if (nowplayingLeaving) return;
      nowplayingToggleLeaving();
      const totalMovies = nowPlayingData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setNowplayingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const topRatedIncraseIndex = () => {
    if (topRatedData) {
      if (topRatedLeaving) return;
      topRatedToggleLeaving();
      const totalMovies = topRatedData.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTopRatedIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const upcomingIndexIncraseIndex = () => {
    if (upcomingData) {
      if (upcomingLeaving) return;
      upcomingToggleLeaving();
      const totalMovies = upcomingData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setUpcomingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const nowplayingToggleLeaving = () => setNowplayingLeaving((prev) => !prev);
  const topRatedToggleLeaving = () => setTopRatedLeaving((prev) => !prev);
  const upcomingToggleLeaving = () => setUpcomingLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const bigMovieMatch = useMatch("/movies/:movieId");
  const onOverlayClick = () => navigate("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    nowPlayingData?.results.find(
      (movie: any) => movie.id === +bigMovieMatch.params.movieId!
    );

  return (
    <Wrapper>
      {nowPlayingLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              nowPlayingData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingData?.results[0].title}</Title>
            <Overview>{nowPlayingData?.results[0].overview}</Overview>
          </Banner>

          <NowPlayingSlider>
            <TitleWrap>
              <SliderTitle>Now Playing Movies</SliderTitle>
              <NextButton onClick={nowplayingIncraseIndex}>&rarr;</NextButton>
            </TitleWrap>

            <AnimatePresence
              initial={false}
              onExitComplete={nowplayingToggleLeaving}
            >
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={nowplayingIndex}
              >
                {nowPlayingData?.results
                  .slice(1)
                  .slice(
                    offset * nowplayingIndex,
                    offset * nowplayingIndex + offset
                  )
                  .map((movie: any) => (
                    <Box
                      layoutId={"nowplaying" + movie.id + ""}
                      key={movie.id}
                      bgphoto={makeImagePath(movie?.backdrop_path, "w500")}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      transition={{ type: "tween" }}
                      onClick={() => onBoxClicked(movie.id)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </NowPlayingSlider>
          <TopRatedtSlider>
            <TitleWrap>
              <SliderTitle>Top Rated Movies</SliderTitle>
              <NextButton onClick={topRatedIncraseIndex}>&rarr;</NextButton>
            </TitleWrap>

            <AnimatePresence
              initial={false}
              onExitComplete={topRatedToggleLeaving}
            >
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={topRatedIndex}
              >
                {topRatedData?.results
                  .slice(
                    offset * topRatedIndex,
                    offset * topRatedIndex + offset
                  )
                  .map((movie: any) => (
                    <Box
                      layoutId={"toprated" + movie.id + ""}
                      key={movie.id}
                      bgphoto={makeImagePath(movie?.backdrop_path, "w500")}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      transition={{ type: "tween" }}
                      onClick={() => onBoxClicked(movie.id)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </TopRatedtSlider>
          <UpcomingSlider>
            <TitleWrap>
              <SliderTitle>Updoming Movies</SliderTitle>
              <NextButton onClick={upcomingIndexIncraseIndex}>
                &rarr;
              </NextButton>
            </TitleWrap>

            <AnimatePresence
              initial={false}
              onExitComplete={upcomingToggleLeaving}
            >
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={upcomingIndex}
              >
                {upcomingData?.results
                  .slice(
                    offset * upcomingIndex,
                    offset * upcomingIndex + offset
                  )
                  .map((movie: any) => (
                    <Box
                      layoutId={"upcoming" + movie.id + ""}
                      key={movie.id}
                      bgphoto={makeImagePath(movie?.backdrop_path, "w500")}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      transition={{ type: "tween" }}
                      onClick={() => onBoxClicked(movie.id)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </UpcomingSlider>
          <MovieLatest>
            <SliderTitle>Latest Movie</SliderTitle>
            <Title>{latestData?.title}</Title>
            <Overview>{latestData?.overview}</Overview>
          </MovieLatest>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigText>{`🗓️ : ${clickedMovie.release_date}`}</BigText>
                      <BigText>{`⭐️ : ${clickedMovie.vote_average}`}</BigText>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
