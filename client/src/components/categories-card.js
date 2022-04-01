import "../styles/index.css";
import { Row, Col, Card } from "react-bootstrap";
import { categories } from "../utils/figures-categories";
import { Link } from "react-router-dom";
export default function CategoriesCard() {
  return (
    <main>
      <h2 className="mb-5 text-center">
        GET READY TO DISCOVER THE MOST POPULAR ANIME FIGURES
      </h2>
      <Row xs={1} md={2} className="g-4">
        {categories.map((category) => (
          <Link
            to={category.path}
            key={category.key}
            className="textDecoration"
          >
            <Col>
              <Card>
                <Card.Img
                  variant="top"
                  src={category.img}
                  alt={category.title}
                />
                <Card.Body>
                  <Card.Title className="text-center">
                    {category.title}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Link>
        ))}
      </Row>
    </main>
  );
}
