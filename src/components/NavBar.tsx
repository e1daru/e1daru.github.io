export default function NavBar() {
  return (
    <nav className="nav-line page-center">
      <p className="nav-full-name">
        <a href="/">Eldar Utiushev</a>
      </p>
      <div className="nav-right-side">
        <ul className="nav-right-side-list">
          <li>
            <a href="mailto:eldaru33@gmail.com">eldaru33@gmail.com</a>
          </li>
          <li>
            <a href="/profile">About</a>
          </li>
          <li>
            <a href="/projects">Projects</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
