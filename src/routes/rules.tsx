import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { DefaultContainer } from '../components/Containers';



const Rules = () => {
  const homeFlag = require('../assets/MEX.png');
  const awayFlag = require('../assets/POL.png');
  return (
    <>
      <Navbar />
      <Header title="Rules"/>
      <DefaultContainer>
        <div className="py-4 px-8 bg-white shadow-lg rounded-lg my-2 pb-24">
          <h2 className="text-2xl font-bold text-gray-900 pt-8">Predictions</h2>
          <p className="pt-2">You can input your predictions until 2 hours before game starts</p>
          <h2 className="text-2xl font-bold text-gray-900 pt-8">Exact Score</h2>
          <p className="pt-2">If you predict the exact final score of a game you get <span className="font-bold">15 points</span>.</p>
          <h2 className="text-2xl font-bold text-gray-900 pt-8">Winner Prediction</h2>
          <p className="pt-2">If you predict the winner (but not exact) you get <span className="font-bold">10 points - the goals difference</span>.<br/>          <div className="pt-8 text-xs text-gray-500">Example:</div>
              <table>
              <tr>
                <td></td>
                <td className="text-center"><img className="w-8 md:w-12 border" alt="home" src={homeFlag} /></td>
                <td className="text-gray-400 text-center p-2">VS</td>
                <td className="text-center"><img className="w-8 md:w-12 border" alt="away" src={awayFlag} /></td>
              </tr>
              <tr>
                <td className="bold text-right pr-4">Your Prediction:</td>
                <td className="text-center">2</td>
                <td className="text-center text-gray-300">–</td>
                <td className="text-center">1</td>
              </tr>
              <tr>
                <td className="bold text-right pr-4">Match Score:</td>
                <td className="text-center">1</td>
                <td className="text-center text-gray-300">–</td>
                <td className="text-center">0</td>
              </tr>
              <tr>
                <td className="bold text-right pr-4">Formula:</td>
                <td className="text-center" colSpan={3}>10 - |2 - 1| - |1 - 0|</td>
              </tr>
              <tr>
                <td className="bold text-right pr-4">You get:</td>
                <td className="text-center font-bold" colSpan={3}>8 points</td>
              </tr>
            </table>
          </p>
        </div>
      </DefaultContainer>
    </>
  );
}

export default Rules;
