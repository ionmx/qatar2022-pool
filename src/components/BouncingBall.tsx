const BouncingBall = () => {
  return (
    <div className="flex items-center justify-center min-h-screen text-gray-900 text-2xl">
      <svg className="animate-bounce w-12 h-12" viewBox="0 0 50 50">
        <circle r="24" cx="24" cy="24" fill="#DDDDDD"></circle>
      </svg>
    </div>
  );
};

export default BouncingBall;