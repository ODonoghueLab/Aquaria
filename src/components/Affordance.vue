<template>
    <div id='affordance_mode'>
    <!-- <h3 id='gene_name'></h3> -->
    <Title3D id='title' class="item title" />
    </div>
</template>

<script>
import Title3D from './Title3D'

export default {
  name: 'AffordanceMode',
  components: {
    Title3D
  }
}
</script>

<style scoped>
#affordance_mode{
    width: 50vw;
    position: absolute;
    margin-left: 25vw;
    height: 0px;
}
#gene_name{
    font-size: 2vh;
    position: relative;
    top: 31px;
    background-color: #99999991;
    color: white;
    border-radius: 17px;
    width: fit-content;
    padding: 1vh;
    z-index: 1;
    text-transform: none;
}

#gene_name:hover {
  transform: scale(1.1);
  border-color: black;
}

.title{
  z-index: 1;
  position: relative;
  top: 2vh;
  flex-basis: auto;
  color: white;
  text-align: center;
  line-height: 2.5;
  padding: 0.5rem 1.5rem;
  border-radius: 1.5rem;
  margin: auto;
  transition: all 0.7s ease;
}

/* #title:hover {
    padding-left: 3rem;
} */
/* #title3D{
    height: 5vh;
    font-size: 2vh;
    background-color: #99999991;
    color: white;
    padding: 2vh 1vh 4px 1.5vh;
    border-radius: 17px;
    top: 33px;
    height: fit-content;
    position: fixed;
    z-index: 1;
} */
</style>
