import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <img
          src="/images/404.png"
          alt="not found"
          style={{ maxWidth: "30%" }}
        />
        <h1>Oh no! Page not found.</h1>
        <h6 className="px-2">
          The page you are looking for doesn't exist or an other error occurred.
        </h6>
        <Link to="/">
          <button className="btn btn-lg btnTextColor btnBgColor btn-block mb-4">
            Take me to home
          </button>
        </Link>
      </div>
    </div>
  );
}
