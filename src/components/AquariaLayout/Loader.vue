<template>
    <div class="loader">
    </div>
</template>

<script>
export default {
  name: 'Loader'
}
</script>

<style scoped>
.loader {
  width: 220px;
  height: 220px;
  padding: 20px;
  /* position: absolute;
  top:30%;
  left:40%; */
  margin: auto;
  background-image: url("../../assets/images/aquaria-loader3.svg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 9rem;
}
</style>
