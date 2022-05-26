import { MatchProps } from "../interfaces";
import Moment from 'react-moment';
import 'moment-timezone';

export default (match: MatchProps) => {
  const homeFlag = require('../assets/' + match.home + '.webp');
  const awayFlag = require('../assets/' + match.away + '.webp');

  return (
    <div className="py-4 px-8 bg-white shadow-lg rounded-lg my-2">
      <table className="w-full border-separate [border-spacing:0.75rem]">
        <tbody>
          <tr>
            <td className="w-10"><img className="w-12 border" src={homeFlag} /></td>
            <td className="text-xl">{match.homeName}</td>
            <td className="text-right">
              <>{match.homeScore! > -1 ? match.homeScore : <span className="text-gray-300">--</span>}</>
            </td>
          </tr>
          <tr>
            <td><img className="w-12 border" src={awayFlag} /></td>
            <td className="text-xl">{match.awayName}</td>
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