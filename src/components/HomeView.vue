<template>
  <div>
    <h1>Hello</h1>
    <div>
      <ul>
        <li>CHAMPION LIST</li>
        <!-- <li v-for="champ in championList" :key="champ.id"> 
           <h5>{{champ.name}}</h5> 
            <img :src="`https://ddragon.leagueoflegends.com/cdn/12.8.1/img/champion/${champ.image.full}`"/> 
          </li> -->
      </ul>
    </div>
    <!-- <top-enemies :championCount="getAnswer"></top-enemies> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "HomeView",
  data() {
    return {
      summonerName: "SaltFreeRobot",
      summonerPuuid: "",
      result: {},
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
