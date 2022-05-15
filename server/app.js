require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const app  = express();
const RIOT_API_KEY  = process.env.RIOT_API_KEY || '';

function riotURLCreator(type, key, params)  {
    switch(type){
        case 'champions':
            return `http://ddragon.leagueoflegends.com/cdn/12.8.1/data/en_US/champion.json`;
        case 'summoner':
            return `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${params.name}?api_key=${key}`;
        case 'matches':
            return  `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${params.puuid}/ids?queue=420&count=20&api_key=${key}`;
        case 'match':
            return `https://americas.api.riotgames.com/lol/match/v5/matches/${params.matchId}?api_key=${key}`
        default:
            return ''
    }
}
app.use(function(_req, res, next) {
  res.set({
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Headers" : "Origin, X-Requested-With, content-type, Accept"
  });
  app.disable('x-powered-by');
  next();
 });
 
app.get('/api/champions', async (_req,res) => { 
  try {
    const response = await superagent.get(riotURLCreator('champions', RIOT_API_KEY));
    const { data } = response.body;
    res.json(data);
  } catch(err) {
    console.log(err)
  }
})
app.get('/api/summoner', async (req,res) => {
  try {
    const response = await superagent.get(riotURLCreator('summoner',RIOT_API_KEY,req.query));
    res.json({puuid: response.body.puuid});
  } catch(err) {
    console.log(err)
  }
})

app.get('/api/matches', async (req, res) => {
  try {
    const response = await superagent.get(riotURLCreator('matches', RIOT_API_KEY, req.query));
    res.json({matchIds: response.body});
  } catch(err) {
    console.log(err)
  }
})
app.get('/api/match', async (req,res) => {
  try {
    const response = await superagent.get(riotURLCreator('match',RIOT_API_KEY, req.query));
    
    res.json({ participants: response.body.info.participants });
  } catch(err) {
    console.log(err)
  }
})


app.listen(3000, function(){
  console.log('Youre listening on port 3000!' );
})