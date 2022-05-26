import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { DefaultContainer } from '../components/Containers';


export default () => {
  return (
    <>
      <Navbar />
      <Header title="Rules"/>
      <DefaultContainer>
        TODO: Write pool rules.
      </DefaultContainer>
    </>
  );
}