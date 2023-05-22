import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  getAiringTodayTv,
  getPopularTv,
  getTopRatedTv,
  getLatestTv,
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

const LatestSlider = styled.div`
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
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const offset = 6;

export default function Tv() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  const useMultipleQuery = () => {
    const airingToday = useQuery(["nowPlaying"], getAiringTodayTv);
    const popular = useQuery(["topRated"], getPopularTv);
    const topRated = useQuery(["upcoming"], getTopRatedTv);
    const latest = useQuery(["latest"], getLatestTv);

    return [airingToday, popular, topRated, latest];
  };

  const [
    { data: airingTodaygData, isLoading: airingTodayLoading },
    { data: popularData },
    { data: topRatedData },
    { data: latestData },
  ] = useMultipleQuery();
  const [airingTodayIndex, setAiringTodayIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [topRatedIndex, setTopRatedIndex] = useState(0);
  const [airingTodayLeaving, setAiringTodayLeaving] = useState(false);
  const [popularLeaving, setPopularLeaving] = useState(false);
  const [topRatedLeaving, setTopRatedLeaving] = useState(false);

  const airingTodayIncraseIndex = () => {
    if (airingTodaygData) {
      if (airingTodayLeaving) return;
      airingTodayToggleLeaving();
      const totalMovies = airingTodaygData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setAiringTodayIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const popularIncraseIndex = () => {
    if (popularData) {
      if (popularLeaving) return;
      popularToggleLeaving();
      const totalMovies = popularData.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setPopularIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const topRatedIncraseIndex = () => {
    if (topRatedData) {
      if (topRatedLeaving) return;
      topRatedToggleLeaving();
      const totalMovies = topRatedData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTopRatedIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const airingTodayToggleLeaving = () => setAiringTodayLeaving((prev) => !prev);
  const popularToggleLeaving = () => setPopularLeaving((prev) => !prev);
  const topRatedToggleLeaving = () => setTopRatedLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    navigate(`/tv/${tvId}`);
  };
  const bigMovieMatch = useMatch("/tv/:tvId");
  const onOverlayClick = () => navigate("/tv");

  const clickedMovie =
    bigMovieMatch?.params.tvId &&
    airingTodaygData?.results.find(
      (movie: any) => movie.id === +bigMovieMatch.params.tvId!
    );

  return (
    <Wrapper>
      {airingTodayLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <Banner
            // onClick={incraseIndex}
            bgphoto={makeImagePath(
              airingTodaygData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{airingTodaygData?.results[0].title}</Title>
            <Overview>{airingTodaygData?.results[0].overview}</Overview>
          </Banner>

          <NowPlayingSlider>
            <TitleWrap>
              <SliderTitle>Airing Today</SliderTitle>
              <NextButton onClick={airingTodayIncraseIndex}>&rarr;</NextButton>
            </TitleWrap>

            <AnimatePresence
              initial={false}
              onExitComplete={airingTodayToggleLeaving}
            >
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={airingTodayIndex}
              >
                {airingTodaygData?.results
                  .slice(1)
                  .slice(
                    offset * airingTodayIndex,
                    offset * airingTodayIndex + offset
                  )
                  .map((movie: any) => (
                    <Box
                      layoutId={"airingtoday" + movie.id + ""}
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
          <LatestSlider>
            <TitleWrap>
              <SliderTitle>popular</SliderTitle>
              <NextButton onClick={popularIncraseIndex}>&rarr;</NextButton>
            </TitleWrap>

            <AnimatePresence
              initial={false}
              onExitComplete={popularToggleLeaving}
            >
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={popularIndex}
              >
                {popularData?.results
                  .slice(offset * popularIndex, offset * popularIndex + offset)
                  .map((movie: any) => (
                    <Box
                      layoutId={"latest" + movie.id + ""}
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
          </LatestSlider>
          <UpcomingSlider>
            <TitleWrap>
              <SliderTitle>Top Rated</SliderTitle>
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
          </UpcomingSlider>
          <MovieLatest>
            <SliderTitle>Latest</SliderTitle>
            <Title>{latestData?.name}</Title>
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
                  layoutId={bigMovieMatch.params.tvId}
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
