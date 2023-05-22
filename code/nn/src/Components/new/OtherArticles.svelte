<script>
  let articles = [
    {
      img: "double_descent.jpg",
      title: "Double Descent",
      description: "Learn about this puzzling phenomena!",
    },
    {
      img: "decision_trees.jpg",
      title: "Decision Trees",
      description: "Learn about the decision tree algorithm",
    },
  ];
</script>

<section>
  <div class="container">
    <p>
      Did you enjoy this content? Then check out our other exciting articles.
    </p>
    <div class="articles">
      {#each articles as article}
        <div class="article">
          <img src={article.img} alt={article.title} />
          <h1>{article.title}</h1>
          <p>{article.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  section {
    background-color: var(--darksquidink);
  }
  .container {
    font-family: var(--font-main);
    color: var(--white);
    margin: auto;
    width: var(--max-width);
  }

  .articles {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .article {
    width: 45%;
    margin-bottom: 20px;
  }

  .article img {
    width: 100%;
    height: auto;
  }

  @media screen and (max-width: 768px) {
    .article {
      width: 100%;
    }
  }
</style>
