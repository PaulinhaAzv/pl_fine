import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-800">
            PL Fine
          </Link>
          <div className="space-x-4">
            <Link to="/planos" className="text-gray-600 hover:text-gray-800">
              Planos
            </Link>
            <Link to="/login" className="text-gray-600 hover:text-gray-800">
              Login
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
