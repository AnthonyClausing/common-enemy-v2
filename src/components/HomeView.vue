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
    <!-- <top-enemies></top-enemies> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import _ from "lodash";
// import TopEnemies from "./TopEnemies.vue";
const ROOT_URL = "http://localhost:3000/api";

type ChampionCountSection = {
  championId: number;
  count: number;
  name: string;
  image: string;
  kda: number;
};
type ChampionCountMap = {
  bonnie: { [key: string]: ChampionCountSection };
  brutus: { [key: string]: ChampionCountSection };
  nemisis: { [key: string]: ChampionCountSection };
};
type ChampionCountResult = {
  bonnie: ChampionCountSection[];
  brutus: ChampionCountSection[];
  nemisis: ChampionCountSection[];
};
type HomeState = {
  summonerName: string;
  summonerPuuid: string;
  result: ChampionCountResult;
};
export default defineComponent({
  name: "HomeView",
  components: {
    // TopEnemies,
  },
  data(): HomeState {
    return {
      summonerName: "SaltFreeRobot",
      summonerPuuid: "",
      result: {
        bonnie: [],
        brutus: [],
        nemisis: [],
      },
    };
  },
  computed: {
    // isLoading(){
    //   return state.loading
    // },
  },
  mounted() {
    // TODO Turn below axios calls into state actions
    axios
      .get(`${ROOT_URL}/summoner?name=${this.summonerName}`)
      .then((res) => {
        this.summonerPuuid = res.data.puuid;
        return axios.get(`${ROOT_URL}/matches?puuid=${res.data.puuid}`);
      })
      .then((res) => this.getMatchListInfo(res.data.matchIds))
      .then((newMatchList) => {
        this.result = this.getChampCounts(newMatchList);
      })
      .catch((err) => console.error(err));
  },
  methods: {
    getMatchListInfo: async function (matchIds: string[]) {
      let matches: any = [];
      for (let matchId of matchIds) {
        let { data } = await axios.get(`${ROOT_URL}/match?matchId=${matchId}`);
        matches.push(data);
      }
      return matches;
    },
    //can add another parameter like a bool for checking for bad allies putting it in the if block
    getChampCounts: function (matches: any) {
      let championCounter: any = {
        bonnie: {},
        brutus: {},
        nemisis: {},
      };
      matches.forEach((match: any) => {
        let userMatchInfo = _.find(match.participants, [
          "puuid",
          this.summonerPuuid,
        ]);
        if (!userMatchInfo.win) {
          match.participants.forEach((player: any) => {
            if (player.puuid === userMatchInfo.puuid) return;
            if (player.teamId !== userMatchInfo.teamId) {
              if (championCounter.nemisis[player.championId]) {
                championCounter.nemisis[player.championId].count++;
              } else {
                championCounter.nemisis[player.championId] = {
                  count: 1,
                  name: player.championName,
                  image: `${player.championName}.png`,
                };
              }
            } else {
              if (championCounter.brutus[player.championId]) {
                championCounter.brutus[player.championId].count++;
              } else {
                championCounter.brutus[player.championId] = {
                  count: 1,
                  name: player.championName,
                  image: `${player.championName}.png`,
                };
              }
            }
          });
        } else {
          match.participants.forEach((player: any) => {
            if (player.puuid === userMatchInfo.puuid) return;
            if (player.teamId === userMatchInfo.teamId) {
              if (championCounter.bonnie[player.championId]) {
                championCounter.bonnie[player.championId].count++;
              } else {
                championCounter.bonnie[player.championId] = {
                  count: 1,
                  name: player.championName,
                  image: `${player.championName}.png`,
                };
              }
            }
          });
        }
      });
      return championCounter;
    },
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
