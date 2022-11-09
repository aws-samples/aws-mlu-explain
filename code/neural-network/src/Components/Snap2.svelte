<center>
  <div class="parent">
    <li id="colorful">This is Section 1</li>
    <li>This is Section 2</li>
    <li id="colorful">This is Section 3</li>
    <li>This is Section 4</li>
    <li id="colorful">This is Section 5</li>
    <li>This is Section 6</li>
    <li id="colorful">This is Section 7</li>
  </div>
</center>

<style>
  .parent {
    margin-top: 20%;
    width: 100%;
    scroll-snap-type: y mandatory;
    flex-basis: 50%;
    max-height: 100vh;
    overflow-y: scroll;
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
    height: 80vh;
  }

  #colorful {
    background-color: #abcdef;
  }

  ::-webkit-scrollbar {
    display: none;
  }
</style>
