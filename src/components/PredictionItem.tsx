import { useAuth } from "../context/AuthContext";
import { db } from '../config/firebase';
import { ref, set } from 'firebase/database';
import { PredictionProps } from "../interfaces";
import Moment from 'react-moment';
import 'moment-timezone';

export default (match: PredictionProps) => {
  const user = useAuth();
  const homeFlag = require('../assets/' + match.home + '.webp');
  const awayFlag = require('../assets/' + match.away + '.webp');

  const homePredictionHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    set(ref(db, `predictions/${user?.uid}/${match.id}/homePrediction`), event.target.value);
  };

  const awayPredictionHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    set(ref(db, `predictions/${user?.uid}/${match.id}/awayPrediction`), event.target.value);
  };

  return (
    <div className="py-4 px-8 bg-white shadow-lg rounded-lg my-2">
      <table className="w-full border-separate [border-spacing:0.75rem]">
        <tbody>
          <tr>
            <td className="w-10"><img className="w-12 border" src={homeFlag} /></td>
            <td className="text-xl">{match.homeName}</td>
            <td className="text-right">
              {match.uid == user?.uid && (
                <input
                  type="number"
                  value={match.homePrediction! > -1 ? match.homePrediction : ''}
                  onChange={homePredictionHandler}
                  className="w-16 shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight text-center appearance-none outline-none"
                />
              )}
              {match.uid != user?.uid && (
                <span className="border p-2 rounded-md bg-gray-100">{match.homePrediction! > -1 ? match.homePrediction : '-'}</span>
              )}
            </td>
            <td className="text-right">
              <>{match.homeScore! > -1 ? match.homeScore : <span className="text-gray-300">--</span>}</>
            </td>
            <td rowSpan={2} className="text-right text-green-500 text-3xl w-10">
              <>{match.points! > -1 ? match.points : <span className="text-gray-300">--</span>}</>
            </td>
          </tr>
          <tr>
            <td><img className="w-12 border" src={awayFlag} /></td>
            <td className="text-xl">{match.awayName}</td>
            <td className="text-right">
              {match.uid == user?.uid && (
                <input
                  type="number"
                  value={match.awayPrediction! > -1 ? match.awayPrediction : ''}
                  onChange={awayPredictionHandler}
                  className="w-16 shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight text-center appearance-none outline-none"
                />
              )}
              {match.uid != user?.uid && (
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