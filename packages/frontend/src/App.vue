<script setup lang="ts">
import { ref } from 'vue'
import { io } from "socket.io-client";

const socket = io('ws://localhost:3000')

socket.on("connection", (socket) => {
  socket.on("disconnect", () => {
    gameState.value = {
      currentPlayer: undefined,
      status: undefined,
      field: undefined,
      playerAPoints: 0,
      playerBPoints: 0
    }
  });
});

//TODO: display errors on screen
socket.on('error', console.error)

const gameState = ref({
  currentPlayer: undefined,
  status: undefined,
  field: undefined,
  playerAPoints: 0,
  playerBPoints: 0
})

function start() {
  fetch(`http://localhost:3000/start`, 
    { method: 'POST', mode: 'no-cors' }
  )
    .then(r => r.text())
    .then(console.log)
}

function clickCell(i: number, j: number) {
  socket.emit('click', { i, j} );
}

socket.on('state', function (data) {
  console.log('Got state', data);
  gameState.value = data;
});
socket.on('message', console.log)
</script>

<template>
  <header>
    <h1>Welcome to Sapper Reverted game</h1>
  </header>

  <main>
    <div v-if="gameState.status === 'started'">
      <div>
        <h3>Stats</h3>
        <p>your id: {{ socket.id }}</p>
        <p>Player 1 points: {{ gameState.playerAPoints }}</p>
        <p>Player 2 points: {{ gameState.playerBPoints }}</p>
        <p>Current player: {{ gameState.currentPlayer }}</p>
      </div>
      <div style="min-height: 36px;">
        <h2 v-if="gameState.currentPlayer === socket.id">Your turn</h2>
      </div>
      <table class="field-table">
        <tr v-for="(line, lineIndex) in gameState.field">
          <td :class="{ red: cell === -1 }" v-for="(cell, cellIndex) in line" @click="clickCell(lineIndex, cellIndex)">
            {{ cell === null ? ' ' : cell === -1 ? 'a' : cell }}
          </td>
        </tr>
      </table>
      <div v-if="gameState.status === 'finished'">
        Game is over
        <button @click="start()">Start again</button>
      </div>
      <!-- <GameField /> -->
    </div>
    <div v-else>
      <button @click="start()">Start</button>
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

td {
  border: solid 1px;
  min-width: 40px;
  height: 40px;
  font-size: 20px;
  text-align: center;
}
td.red {
  background-color: pink;
}
</style>
