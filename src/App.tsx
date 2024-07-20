import { useEffect, useState } from 'react';
import './index.css';
import Arrow from './icons/Arrow';
import { bear, coin, highVoltage, notcoin, rocket, trophy } from './images';

const App = () => {
  const [points, setPoints] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(2532);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showShopMessage, setShowShopMessage] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<{ user: string, points: number }[]>([]);
  const pointsToAdd = 1; // Changed value to 1
  const energyToReduce = 12;

  useEffect(() => {
    // Retrieve stored points from local storage
    const storedPoints = parseInt(localStorage.getItem('points') || '0', 10);
    setPoints(storedPoints);

    // Retrieve leaderboard from local storage
    const storedLeaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    setLeaderboard(storedLeaderboard);

    const interval = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + 1, 6500));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (energy - energyToReduce < 0) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPoints = points + pointsToAdd;
    setPoints(newPoints);
    localStorage.setItem('points', newPoints.toString());
    updateLeaderboard(newPoints);

    setEnergy(energy - energyToReduce < 0 ? 0 : energy - energyToReduce);
    setClicks([...clicks, { id: Date.now(), x, y }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  const updateLeaderboard = (newPoints: number) => {
    const username = "currentUser"; // Replace with actual username logic
    const currentLeaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');

    const userIndex = currentLeaderboard.findIndex((entry: { user: string, points: number }) => entry.user === username);
    if (userIndex >= 0) {
      currentLeaderboard[userIndex].points = newPoints;
    } else {
      currentLeaderboard.push({ user: username, points: newPoints });
    }

    // Sort leaderboard by points in descending order
    currentLeaderboard.sort((a: { points: number }, b: { points: number }) => b.points - a.points);

    localStorage.setItem('leaderboard', JSON.stringify(currentLeaderboard));
    setLeaderboard(currentLeaderboard);
  };

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  const handleShopClick = () => {
    setShowShopMessage(true);
    setTimeout(() => {
      setShowShopMessage(false);
    }, 2000); // Hide the message after 2 seconds
  };

  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">

      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">

        <div className="fixed top-0 left-0 w-full px-4 pt-8 z-10 flex flex-col items-center text-white">
          <div className="w-full cursor-pointer">
            <div className="bg-[#1f1f1f] text-center py-2 rounded-xl">
              <p className="text-lg">Join squad <Arrow size={18} className="ml-0 mb-1 inline-block" /></p>
            </div>
          </div>
          <div className="mt-12 text-5xl font-bold flex items-center">
            <img src={coin} width={44} height={44} />
            <span className="ml-2">{points.toLocaleString()}</span>
          </div>
          <div className="text-base mt-2 flex items-center">
            <img src={trophy} width={24} height={24} />
            <span className="ml-1">Gold <Arrow size={18} className="ml-0 mb-1 inline-block" /></span>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full px-4 pb-4 z-10">
          <div className="w-full flex justify-between gap-2">
            <div className="w-1/3 flex items-center justify-start max-w-32">
              <div className="flex items-center justify-center">
                <img src={highVoltage} width={44} height={44} alt="High Voltage" />
                <div className="ml-2 text-left">
                  <span className="text-white text-2xl font-bold block">{energy}</span>
                  <span className="text-white text-large opacity-75">/ 6500</span>
                </div>
              </div>
            </div>
            <div className="flex-grow flex items-center max-w-60 text-sm">
              <div className="w-full bg-[#fad258] py-4 rounded-2xl flex justify-around">
                <button className="flex flex-col items-center gap-1" onClick={handleShopClick}>
                  <img src={bear} width={24} height={24} alt="Shop" />
                  <span>Shop</span>
                </button>
                <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                <button className="flex flex-col items-center gap-1" onClick={toggleLeaderboard}>
                  <img src={coin} width={24} height={24} alt="Leaderboard" />
                  <span>Leaderboard</span>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full bg-[#f9c035] rounded-full mt-4">
            <div className="bg-gradient-to-r from-[#f3c45a] to-[#fffad0] h-4 rounded-full" style={{ width: `${(energy / 6500) * 100}%` }}></div>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center">
          <div className="relative mt-4" onClick={handleClick}>
            <img src={notcoin} width={256} height={256} alt="notcoin" />
            {clicks.map((click) => (
              <div
                key={click.id}
                className="absolute text-5xl font-bold opacity-0"
                style={{
                  top: `${click.y - 42}px`,
                  left: `${click.x - 28}px`,
                  animation: `float 1s ease-out`
                }}
                onAnimationEnd={() => handleAnimationEnd(click.id)}
              >
                {pointsToAdd} {/* Changed to use pointsToAdd */}
              </div>
            ))}
          </div>
        </div>

        {showLeaderboard && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
            <div className="bg-white p-4 rounded-lg w-80">
              <h2 className="text-black text-xl font-bold mb-4">Leaderboard</h2>
              <ul>
                {leaderboard.map((entry, index) => (
                  <li key={index}>{entry.user}: {entry.points} points</li>
                ))}
              </ul>
              <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded" onClick={toggleLeaderboard}>Close</button>
            </div>
          </div>
        )}

        {showShopMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
            <div className="bg-white p-4 rounded-lg w-80">
              <h2 className="text-black text-xl font-bold">Shop</h2>
              <p className="text-black mt-2">Coming Soon</p>
              <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded" onClick={() => setShowShopMessage(false)}>Close</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
