<template>
    <div id='waitingFrame'>
        <div id='waitinghtml'>
            <br>
            <br>
            <br>
            <p id="appletMessage">
            Please wait asec...
            </p>
            <img :src='loader'>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Loader',
  data () {
    return {
      loader: require('../../assets/img/aquaria-loader3.svg')
    }
  }
}
</script>

<style type=text/css scoped>
#waitinghtml {
background-color: rgba(0,0,0,0.7);
pointer-events: none;
/* background-image: url('../../assets/img/aquaria-loader3.svg'); */
background-repeat: no-repeat;
background-position: center;
height: 100vh;
}
p {
color: white;
text-align:center;
}
img {
    width: 20vh;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}
</style>
