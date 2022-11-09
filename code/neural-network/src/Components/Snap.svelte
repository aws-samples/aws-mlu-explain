<div class="wrapper">
  <div class="container">
    <h2>scroll-snap-type: y <em>mandatory</em></h2>
    <ul>
      <li>Lorem, ipsum dolor.</li>
      <li>Doloremque, maxime id.</li>
      <li>Mollitia, qui beatae?</li>
      <li>Sit, fuga repellendus!</li>
      <li>Reiciendis, commodi asperiores?</li>
      <li>Dicta, deleniti tempore?</li>
      <li>Recusandae, rerum numquam.</li>
      <li>Cumque, quos eveniet?</li>
      <li>Accusamus, libero in.</li>
      <li>Reprehenderit, minus debitis.</li>
      <li>Minima, dolores nobis?</li>
      <li>Iure, consequatur illum!</li>
      <li>Atque, nostrum libero!</li>
      <li>Minima, porro veritatis?</li>
      <li>Explicabo, non itaque.</li>
      <li>Quidem, mollitia porro.</li>
      <li>Maiores, recusandae voluptatem.</li>
      <li>Inventore, autem cupiditate?</li>
      <li>Illum, reprehenderit quos.</li>
      <li>Sapiente, obcaecati facilis.</li>
    </ul>
  </div>
</div>

<style>
  * {
    box-sizing: border-box;
  }
  body {
    font-family: sans-serif;
  }

  .wrapper {
    display: flex;
    margin: auto;
    justify-content: center;
  }

  h2 {
    position: fixed;
    text-align: center;
    font-size: 1.5rem;
    font-family: monospace;
    width: 50%;
    top: 1em;
  }

  h2 em {
    font-weight: bold;
  }

  .container {
    flex-basis: 100%;
    max-height: 100vh;
    overflow-y: scroll;
    border: 1px solid gray;
    scroll-snap-type: y mandatory;
  }

  .proximity {
    scroll-snap-type: y proximity;
  }

  li {
    border-bottom: 1px solid white;
    padding: 3rem;
    font-size: 1.4rem;
    color: rgba(white, 0.5);
    background: lightgray;
    text-align: center;
    scroll-snap-align: start;
    display: flex;
    flex-flow: column;
    justify-content: center;
    min-height: 50vh;
  }
</style>
