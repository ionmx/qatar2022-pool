import { useMatches } from '../context/MatchesContext'
import moment from 'moment'
import Navbar from "../components/Navbar";
import MatchItem from "../components/MatchItem";
import Header from "../components/Header";
import { MatchesContainer } from '../components/Containers';
import { Fragment } from 'react';

const Matches = () => {
  const matches = useMatches();

  let prevDate = '';
  let matchDate = '';

  return (
    <>
      <Navbar />
      <Header title="Matches" />
      <MatchesContainer>
        {matches?.map((match, index) => {
          matchDate = moment(match.date).format('dddd, MMMM DD, YYYY');
          if (matchDate !== prevDate) {
            prevDate = matchDate;
            return (
              <Fragment key={`${match.id}-header`}>
                <div className="md:col-span-2 text-xl mt-4 bt-4">{matchDate}</div>
                <MatchItem key={match.id} {...match} />
              </Fragment>
            );
          } else {
            prevDate = matchDate;
            return (
              <MatchItem key={match.id} {...match} />
            );
          }
        })}
      </MatchesContainer>
    </>
  );
}

export default Matches;