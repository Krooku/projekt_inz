<template>
  <div class="header row">
    <div class="politic">
      <a href="../static/PolitykaPrywatnosci.pdf"> Polityka Prywatności</a>
    </div>
    <a>
      Copyright © 2020 EventPlanner
    </a>
  </div>
</template>

<style lang="scss" scoped>
.header {
  text-align: center;
  justify-content: center;
  position: fixed;
  display: block;
  color: var(--secondary-text-color);
  bottom: 0;
  z-index: 40;

  a {
    display: block;
    text-decoration: underline;
    margin: 7px auto 5px auto;
  }

  a:link {
    color: var(--secondary-text-color);
  }

  a:visited {
    color: var(--secondary-text-color);
  }

}
</style>
