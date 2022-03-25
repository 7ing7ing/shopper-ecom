import Carousel from "react-bootstrap/Carousel";
import "../styles/index.css";
export default function CarouselSlides() {
  return (
    <div>
      <h1 className="text-center my-5 p-3">THE BEST ANIME FIGURES</h1>
      <div>
        <Carousel className="md-mx-6">
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="images/naruto.jpg"
              alt="naruto"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="images/onepiece.jpg"
              alt="one piece"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="images/kimetsu.jpg"
              alt="demon slayer"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="images/titans.jpg"
              alt="attack on titans"
            />
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  );
}
