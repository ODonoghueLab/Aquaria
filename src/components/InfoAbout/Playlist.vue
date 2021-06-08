<template>
    <div id='playlists'>
        <span v-for="video in playlist" :key="video.id" :id='video.id' @click="play(video.id)">
            <div class='thumbnail-container'>
                <img :src="'https://img.youtube.com/vi/' + video.id + '/0.jpg'">
                <button class="btn">&#9654;</button>
            </div>
            <p>{{video.title}}</p>
        </span>
    </div>
</template>

<script>
export default {
  name: 'Playlist',
  props: ['playlist'],
  methods: {
    play: function (id) {
      document.querySelector('#contents').className = ' deactive'
      document.getElementById(id).className += ' active'
      document.getElementById('UserHelp').classList.remove('overlay')
      document.getElementById('UserHelp').classList.remove('level7')
      document.getElementById('UserHelp').classList.remove('dialouge-window')
      document.getElementById('UserHelp').className += ' fullwindow'
      for (var i = 0; i < this.$parent.$children.length; i++) {
        if (this.$parent.$children[i].$attrs.id === id) {
          var index = i
        }
      }
      this.$parent.$children[index].player.playVideo()
    }
  }
}
</script>

<style>
.thumbnail-container{
    position: relative;
    width: 50%;
}
.thumbnail-container img {
    width: 100%;
    height: auto;
    padding: 5px;
}
.thumbnail-container .btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    background-color: #555;
    color: white;
    font-size: 16px;
    padding: 12px 24px;
    border: none;
    border-radius: 5px;

}
span:hover .thumbnail-container  .btn{
  background-color: red;
}
#playlists p{
    font-size: 90%;
    float: right;
    width: 50%;
}
#playlists iframe {
    display: none
}
#playlists span {
    display: flex;
    height: 114px;
    cursor: pointer;
}
#playlists span:hover {
    background: #e1e0e0;
}
</style>
