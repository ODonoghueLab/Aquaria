<template>
    <div id='waitingFrame'>
        <div id='waitinghtml'>
          <img :src='loader' />
          <p id="appletMessage">
          Please wait asec...
          </p>
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
height: 100vh;
width: 100vw;
display: flex;
flex-flow: column wrap;
text-align: center;
}
p#appletMessage {
color: white;
text-align: center;
margin: 2rem auto;
height: 5rem;
}
img {
    width: 20vh;
    /* position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0; */
    margin: auto;
}
</style>
