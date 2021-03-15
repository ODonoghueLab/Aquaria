<template>
    <div class="matrixLoading">
      <div id="waiting_gif">
          <img id="loading_gif" v-bind:src="gif">
      </div>
      <div id="loading_overlay"> LOADING<span id="myspan"></span></div>
    </div>
</template>

<script>
export default {
  name: 'LoadingPage',
  data () {
    return {
      gif: require('../../assets/img/aquaria-spin.gif')
    }
  },
  mounted () {
    document.querySelector('.matrixLoading').style.visibility = 'visible'
    var span = document.getElementById('myspan')

    setInterval(function () {
      if ((span.innerHTML += '.').length === 5) { span.innerHTML = '' }
    }, 500)
  }
}
</script>

<style>
.matrixLoading{
  display: flex;
  visibility: hidden;
  padding: 45vh 45vw;
  background: #ABABAB;
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 9;
}
</style>
