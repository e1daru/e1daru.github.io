export default function Profile() {
  return (
    <section className="profile page-center">
      <div className="photo">
        <img src="/Utiushev_Eldar_Photo.jpg" alt="Eldar Utiushev" />

        <div className="mt-12 flex flex-wrap justify-center gap-6 text-center">
          <a href="mailto:eldaru33@gmail.com" className="btn btn-blue">
            Email Me
          </a>
          <a
            href="https://github.com/e1daru"
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-dark"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/eldaru"
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-lightblue"
          >
            LinkedIn
          </a>
        </div>
      </div>

      <div className="info">
        {/* <div className="eyebrow">/Data Analyst &#x1F914;</div> */}

        <h1 className="name">Hi there!</h1>
        <h1 className="name">
          I’m Eldar — a Data Analyst/Scientist with a dual degree in Business
          Administration and Computer Science at UNC Chapel Hill.
        </h1>

        <p className="summary">
          I believe <strong>data</strong> and <strong>technology</strong> should
          empower people to solve meaningful problems and create{" "}
          <strong>lasting impact</strong>. By combining analytics, software, and
          leadership, I bridge the gap between ideas and execution—building
          data-driven solutions, crafting software products, leading teams at
          national events, advising on <strong>multi-million-dollar</strong>{" "}
          projects, and co-founding initiatives that{" "}
          <strong>bring people together</strong>.
        </p>
      </div>
    </section>
  );
}
