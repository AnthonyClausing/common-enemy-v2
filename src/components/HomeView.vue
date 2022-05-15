<template>
  <div>
    <h1>Hello</h1>
    <button :onClick="makeApiCalls">CLICK HERE</button>
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
  methods: {
    async makeApiCalls() {
      try {
        const summonerResponse = await axios.get(
          `${ROOT_URL}/summoner?name=${this.summonerName}`
        );
        const matchIdsResponse = await axios.get(
          `${ROOT_URL}/matches?puuid=${summonerResponse.data.puuid}`
        );
        this.summonerPuuid = summonerResponse.data.puuid;
        const matches = await this.getMatchListInfo(
          matchIdsResponse.data.matchIds
        );
        this.result = this.getChampCounts(matches);
      } catch (err) {
        console.error(err);
      }
    },
    getMatchListInfo: async function (matchIds: string[]) {
      let matches: any[] = [];
      for (let matchId of matchIds) {
        let { data } = await axios.get(`${ROOT_URL}/match?matchId=${matchId}`);
        matches.push(data);
      }
      return matches;
    },
    getChampCounts: function (matches: any[]) {
      let champCountMap: ChampionCountMap = {
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
              if (champCountMap.nemisis[player.championId]) {
                champCountMap.nemisis[player.championId].count++;
                champCountMap.nemisis[player.championId].kda +=
                  player.challenges.kda;
              } else {
                champCountMap.nemisis[player.championId] = {
                  championId: player.championId,
                  count: 1,
                  name: player.championName,
                  image: `${player.championName}.png`,
                  kda: player.challenges.kda,
                };
              }
            } else {
              if (champCountMap.brutus[player.championId]) {
                champCountMap.brutus[player.championId].count++;
                champCountMap.brutus[player.championId].kda +=
                  player.challenges.kda;
              } else {
                champCountMap.brutus[player.championId] = {
                  championId: player.championId,
                  count: 1,
                  name: player.championName,
                  image: `${player.championName}.png`,
                  kda: player.challenges.kda,
                };
              }
            }
          });
        } else {
          match.participants.forEach((player: any) => {
            if (player.puuid === userMatchInfo.puuid) return;
            if (player.teamId === userMatchInfo.teamId) {
              if (champCountMap.bonnie[player.championId]) {
                champCountMap.bonnie[player.championId].count++;
                champCountMap.bonnie[player.championId].kda +=
                  player.challenges.kda;
              } else {
                champCountMap.bonnie[player.championId] = {
                  championId: player.championId,
                  count: 1,
                  name: player.championName,
                  image: `${player.championName}.png`,
                  kda: player.challenges.kda,
                };
              }
            }
          });
        }
      });
      return {
        bonnie: _.slice(
          _.orderBy(
            Object.values(champCountMap.bonnie),
            ["count", "kda"],
            ["desc", "desc"]
          ),
          0,
          5
        ),
        brutus: _.slice(
          _.orderBy(
            Object.values(champCountMap.brutus),
            ["count", "kda"],
            ["desc", "asc"]
          ),
          0,
          5
        ),
        nemisis: _.slice(
          _.orderBy(
            Object.values(champCountMap.nemisis),
            ["count", "kda"],
            ["desc", "desc"]
          ),
          0,
          5
        ),
      };
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
