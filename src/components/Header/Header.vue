<template>
    <div id="header">
        <div id="logo" class="item fix level3"><a href="#About" @click="showScrim"><img v-bind:src="aquariasymbol" /></a></div>
        <Title />
        <div id="menu-btn" class="item fix level3"><a href="#Menu"><img v-bind:src="hamburger" /></a></div>
        <Menu />
    </div>
</template>
<script>
import Title from './Title'
import Menu from './Menu'
export default {
  name: 'Header',
  components: {
    Title,
    Menu
  },
  data () {
    return {
      aquariasymbol: require('../../assets/images/aquaria-symbol-01.svg'),
      hamburger: require('../../assets/images/aquaria-menu.svg')
    }
  },
  methods: {
    showScrim: function () {
      document.querySelector('#scrim').className = 'show level3'
    }
  }
}
</script>
<style scoped>
#header {
  display: flex;
  flex-flow: row nowrap;
  /* Then we define how to distribute the remaining space */
  justify-content: space-between;
  margin-top: 0.5rem;
  width: 100%;
  height: 4em;
}
.item {
    flex-grow: 0;
    flex-basis: calc(2rem + 3 * ((100vw - 320px) / 680));
    display: flex;
}
.item a {
    display: flex;
}
.item  img {
    height: calc(1.75rem + 2vh);
}
#menu-btn {
    right: 2vh;
    top: 2vh;
}
#menu-btn.item img {
    opacity: 0.8;
    height: calc(1rem + 1vh);
}
#menu-btn.item img:hover {
    opacity: 1;
}
#logo {
    left: 1vw;
    top: 0.75vw;
}
strong {
    font-weight: 600;
}
</style>
