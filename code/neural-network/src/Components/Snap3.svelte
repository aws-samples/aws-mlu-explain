<script>
  const sections = [...document.querySelectorAll("section")];
  console.log("sections", sections);

  let options = {
    rootMargin: "0px",
    threshold: 0.75,
  };

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      const { target } = entry;

      if (entry.intersectionRatio >= 0.75) {
        target.classList.add("is-visible");
      } else {
        target.classList.remove("is-visible");
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);

  sections.forEach((section, index) => {
    const sectionChildren = [
      ...section.querySelector("[data-content]").children,
    ];

    sectionChildren.forEach((el, index) => {
      el.style.setProperty("--delay", `${index * 250}ms`);
    });

    observer.observe(section);
  });
</script>

<main>
  <section class="section section-1">
    <div class="section__content" data-content>
      <img
        class="section__img section__img--left"
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/85648/trex.svg"
        alt="T-rex"
      />
      <h2>Content inside</h2>
      <p>blah blah blah</p>
    </div>
  </section>
  <section class="section section-2">
    <div class="section__content" data-content>
      <h2>Content inside</h2>
      <p>blah blah blah</p>
    </div>
  </section>
  <section class="section section-3">
    <header class="section__header">
      <h3 class="section__title">Explore & Discover</h3>
    </header>
    <div class="section__content" data-content>
      <h2>Content inside</h2>
      <p>blah blah blah</p>
    </div>
  </section>
</main>

<style>
  main {
    scroll-snap-type: y mandatory;
    height: 100vh;
    overflow-y: scroll;
  }

  .section {
    color: white;
    position: relative;
    scroll-snap-align: center;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    border: 2px solid black;
  }
  .section {
    height: 100vh;
  }

  .section__content > * {
    opacity: 1;
    transform: translate3d(0, 4rem, 0);
    transition: opacity 800ms var(--delay),
      transform 800ms cubic-bezier(0.13, 0.07, 0.26, 0.99) var(--delay);
  }

  .is-visible .section__content > * {
    opacity: 1;
    transform: translate3d(0, 1rem, 0);
  }
  .is-visible .section__img {
    opacity: 0.75;
  }
</style>
