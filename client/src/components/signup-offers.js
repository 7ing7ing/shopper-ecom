import { Button } from "react-bootstrap";
import "../styles/index.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function SignupOffers() {
  return (
    <div className="border margin-ten d-flex flex-column flex-md-row justify-content-center align-items-center bg-white">
      <i
        className="bi bi-envelope iconColor pad-left-50"
        style={{ fontSize: "70px" }}
      ></i>
      <h3 className="mx-5 text-center"> SIGN UP FOR EXCLUSIVE OFFERS!</h3>

      <input
        type="email"
        placeholder="example@email.com"
        className="me-2 w-75 my-3 flex-grow-1 input-lg"
        aria-label="Email"
      />
      <Button
        variant="default"
        className="btnTextColor btnBgColor pad-right-50 py-1 mb-4 mb-md-0"
      >
        Signup!
      </Button>
    </div>
  );
}
