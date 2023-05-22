import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getSearchMovie, getSearchTv } from "../api";
import { styled } from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

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

const Banner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-size: cover;
`;

const NowPlayingSlider = styled.div`
  position: relative;
`;

const UpcomingSlider = styled.div`
  position: relative;
  top: 400px;
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

const offset = 6;

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data: searchMovieData, isLoading: searchMovieLoading } = useQuery(
    ["search", "searchMovie"],
    () => getSearchMovie(keyword)
  );
  const { data: searchTvData } = useQuery(["search", "searchTv"], () =>
    getSearchTv(keyword)
  );

  useEffect(() => {
    navigate(`/search?keyword=${keyword}`);
  }, [keyword]);

  const [searchMovieIndex, setSearchMovieIndex] = useState(0);
  const [searchTvIndex, setSearchTvIndex] = useState(0);
  const [searchMovieLeaving, setSearchMovieLeaving] = useState(false);
  const [searchTvLeaving, setSearchTvLeaving] = useState(false);

  const searchMovieIncraseIndex = () => {
    if (searchMovieData) {
      if (searchMovieLeaving) return;
      searchMovieToggleLeaving();
      const totalMovies = searchMovieData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setSearchMovieIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const searchTvIncraseIndex = () => {
    if (searchTvData) {
      if (searchTvLeaving) return;
      searchTvToggleLeaving();
      const totalMovies = searchTvData.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setSearchTvIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const searchMovieToggleLeaving = () => setSearchMovieLeaving((prev) => !prev);
  const searchTvToggleLeaving = () => setSearchTvLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    navigate(`/tv/${tvId}`);
  };

  return (
    <Wrapper>
      {searchMovieLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <Banner></Banner>
          <NowPlayingSlider>
            <TitleWrap>
              <SliderTitle>Movie</SliderTitle>
              <NextButton onClick={searchMovieIncraseIndex}>&rarr;</NextButton>
            </TitleWrap>

            <AnimatePresence
              initial={false}
              onExitComplete={searchMovieToggleLeaving}
            >
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={searchMovieIndex}
              >
                {searchMovieData?.results
                  .slice(1)
                  .slice(
                    offset * searchMovieIndex,
                    offset * searchMovieIndex + offset
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
          <UpcomingSlider>
            <TitleWrap>
              <SliderTitle>Tv</SliderTitle>
              <NextButton onClick={searchTvIncraseIndex}>&rarr;</NextButton>
            </TitleWrap>

            <AnimatePresence
              initial={false}
              onExitComplete={searchTvToggleLeaving}
            >
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={searchTvIndex}
              >
                {searchTvData?.results
                  .slice(
                    offset * searchTvIndex,
                    offset * searchTvIndex + offset
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
        </>
      )}
    </Wrapper>
  );
}
