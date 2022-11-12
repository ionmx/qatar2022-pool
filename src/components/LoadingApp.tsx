import CupLogo from '../assets/logo-cup.svg';

const LoadingApp = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <img src={CupLogo} alt="logo" className="animate-bounce" />
    </div>
    )
}

export default LoadingApp;