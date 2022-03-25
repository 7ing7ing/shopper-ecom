import "../styles/index.css";

export default function Footer() {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <div>
      <footer className="bg-pink text-center py-4 mt-5">
        <span>{`© shopper by @7ing7ing ${year}`}</span>
      </footer>
    </div>
  );
}
