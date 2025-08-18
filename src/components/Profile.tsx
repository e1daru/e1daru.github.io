export default function Profile() {
  return (
    <section className="profile page-center">
      <div className="photo">
        <img src="/Utiushev_Eldar_Photo.jpg" alt="Eldar Utiushev" />
      </div>

      <div className="info">
        <div className="eyebrow">Business/Data Analyst &#x1F914;</div>

        <h1 className="name">
          Hi there! I’m Eldar, a dual-degree student in Business Administration
          and Computer Science at UNC Chapel Hill.
        </h1>

        <p className="summary">
          I build data-driven solutions, craft software products, and help
          organizations turn ideas into results. Along the way, I’ve led teams
          at national events, advised on multi-million-dollar projects, and
          co-founded initiatives that bring people together.
        </p>

        <p className="email">
          <a href="mailto:eldaru33@gmail.com">eldaru33@gmail.com</a>
        </p>

        <div className="socials">
          <a
            href="https://github.com/e1daru"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/eldaru"
            target="_blank"
            rel="noreferrer noopener"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
