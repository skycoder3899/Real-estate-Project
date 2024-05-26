import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../app/user/userSlice";

function Header() {
  const { currentUser,accessToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/v1/users/logout", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        dispatch(signOutUserFailure(errorData.message || "Logout failed"));
        return;
      }
      const data = await res.json();
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message || "Logout failed"));
    }
  };

  return (
    <header className="bg-blue-500 shadow-md">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          <Link to="/" >
            MyApp
          </Link>
        </div>
        <ul className="flex space-x-6">
          {(currentUser?.role === "buyer" || currentUser === null) && (
            <li>
              <Link
                to="/"
                className="text-white hover:text-blue-900 transition-colors duration-300"
              >
                Buyer
              </Link>
            </li>
          )}

          {currentUser?.role==="seller" && (
            <li>
              <Link
                to="/seller"
                className="text-white hover:text-blue-900 transition-colors duration-300"
              >
                Seller
              </Link>
            </li>
          )}
          {currentUser ? (
            <li>
              <button
                onClick={handleSignOut}
                className="text-white hover:text-blue-900 transition-colors duration-300"
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="text-white hover:text-blue-900 transition-colors duration-300"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/sign-up"
                  className="text-white hover:text-blue-900 transition-colors duration-300"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
