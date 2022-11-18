import { useAuth } from "../context/AuthContext";
import { db } from '../config/firebase';
import { ref, set } from 'firebase/database';
import { PredictionProps } from "../interfaces";
import Moment from 'react-moment';
import 'moment-timezone';

const PredictionItem = (match: PredictionProps) => {
  const user = useAuth()?.user;
  const homeFlag = require('../assets/' + match.home + '.png');
  const awayFlag = require('../assets/' + match.away + '.png');

  const showSavedNotification = (elementId: string) => {
    const element = document.getElementById(elementId);
    element?.classList.add('animate-spin');
    setTimeout(() => {
      element?.classList.remove('animate-spin');
    }, 1000);
  }

  const homePredictionHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    set(ref(db, `predictions/${user?.uid}/${match.id}/homePrediction`), event.target.value)
      .then(() => {
        showSavedNotification(`flag-home-${match.id}`);
      });
  };

  const awayPredictionHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    set(ref(db, `predictions/${user?.uid}/${match.id}/awayPrediction`), event.target.value)
      .then(() => {
        showSavedNotification(`flag-away-${match.id}`);
      });
  };

  const isEditable = () => {
    let twoHours = 7200;  // Two hours before
    let now = Math.floor(new Date().getTime() / 1000);
    return match.timestamp - now > twoHours;
  }
  
  return (
    <div className="py-4 px-8 bg-white shadow-lg rounded-lg my-2">
      <table className="w-full border-separate [border-spacing:0.75rem]">
        <tbody>
          <tr>
            <td className="w-10"><img id={`flag-home-${match.id}`} className="w-12 border" alt={match.home} src={homeFlag} /></td>
            <td className="text-xl">{match.homeName}</td>
            <td className="text-right">
              {isEditable() && match.uid === user?.uid && (
                <input
                  type="number"
                  value={match.homePrediction! > -1 ? match.homePrediction : ''}
                  onChange={homePredictionHandler}
                  className="w-16 shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight text-center outline-none"
                />
              )}
              {(!isEditable() || match.uid !== user?.uid) && (
                <span className="border p-2 rounded-md bg-gray-100">{match.homePrediction! > -1 ? match.homePrediction : '-'}</span>
              )}
            </td>
            <td className="text-right">
              <>{match.homeScore! > -1 ? match.homeScore : <span className="text-gray-300">--</span>}</>
            </td>
            <td rowSpan={2} className="text-right w-10">
              {match.points! > -1 ? <div className="text-xl text-center rounded-full text-amber-900 bg-amber-300 p-1">{match.points}</div> : <span className="text-gray-300">--</span>}
            </td>
          </tr>
          <tr>
            <td><img id={`flag-away-${match.id}`} className="w-12 border" alt={match.away} src={awayFlag} /></td>
            <td className="text-xl">{match.awayName}</td>
            <td className="text-right">
              {isEditable() && match.uid === user?.uid && (
                <input
                  type="number"
                  value={match.awayPrediction! > -1 ? match.awayPrediction : ''}
                  onChange={awayPredictionHandler}
                  className="w-16 shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight text-center outline-none"
                />
              )}
              {(!isEditable() || match.uid !== user?.uid) && (
                <span className="border p-2 rounded-md bg-gray-100">{match.awayPrediction! > -1 ? match.awayPrediction : '-'}</span>
              )}
            </td>
            <td className="text-right">
              <>{match.awayScore! > -1 ? match.awayScore : <span className="text-gray-300">--</span>}</>
            </td>
          </tr>
          <tr>
            <td colSpan={5} className="text-xs text-gray-700">
              Group: {match.group} · {match.location} · <Moment format="MMM DD, HH:mm">{match.date}</Moment>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PredictionItem;