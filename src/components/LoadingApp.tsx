import CupLogo from '../assets/logo-cup.svg';

export default () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <img src={CupLogo} className="animate-bounce" />
    </div>
    )
}