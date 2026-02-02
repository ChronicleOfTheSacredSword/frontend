<template xmlns="http://www.w3.org/1999/html">
  <div class="map-container">
    <!-- Joueur (rond) -->
    <div class="player" :style="playerStyle"></div>

    <!-- Grille -->
    <div class="grid">
      <div v-for="cellId in ROWS * COLS" :key="cellId" class="cell"></div>
    </div>

    <br />

    <button @click="savePosition">💾 Sauvegarder</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Save {
  id: number
  id_map: number
  id_box: number
}

type Direction = 'up' | 'down' | 'left' | 'right'

// Taille de la carte
const ROWS = 4
const COLS = 9

// Taille visuelle
const CELL_SIZE = 60
const PLAYER_SIZE = 40

// Position du joueur
const playerRow = ref<number>(0)
const playerCol = ref<number>(0)

// ID de la case (1 → 18)
const playerCellId = computed<number>(() => {
  return playerRow.value * COLS + playerCol.value + 1
})

// Style du joueur (position en pixels)
const playerStyle = computed<Record<string, string>>(() => ({
  transform: `translate(
    ${playerCol.value * CELL_SIZE + (CELL_SIZE - PLAYER_SIZE) / 2}px,
    ${playerRow.value * CELL_SIZE + (CELL_SIZE - PLAYER_SIZE) / 2}px
  )`,
}))

// Déplacement
function move(direction: Direction): void {
  switch (direction) {
    case 'up':
      playerRow.value = (playerRow.value - 1 + ROWS) % ROWS
      break

    case 'down':
      playerRow.value = (playerRow.value + 1) % ROWS
      break

    case 'left':
      playerCol.value = (playerCol.value - 1 + COLS) % COLS
      break

    case 'right':
      playerCol.value = (playerCol.value + 1) % COLS
      break
  }

  // Vérification d'un monstre à chaque nouvelle case
  checkRandomMonster()
}

//Evenement apparition monstre
function checkRandomMonster(): void {
  const chance = Math.random() // nombre entre 0 et 1
  if (chance <= 0.05) {
    alert('⚔️ Un monstre apparaît !')
    // TODO: appeler page combat
  }
}

// Sauvegarde
function savePosition(): void {
  localStorage.setItem('playerCellId', playerCellId.value.toString())
  //TODO Sauvegarde dans le service Sauv
}

// Restauration au chargement
onMounted(() => {
  const savedCellId = localStorage.getItem('playerCellId')
  if (savedCellId !== null) {
    const id = Number(savedCellId) - 1
    if (!Number.isNaN(id)) {
      playerRow.value = Math.floor(id / COLS)
      playerCol.value = id % COLS
    }
  }

  //TODO Chargement de la sauvegarde du héros

  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Déplacement clavier
function handleKeydown(event: KeyboardEvent): void {
  switch (event.key) {
    case 'ArrowUp':
      move('up')
      break
    case 'ArrowDown':
      move('down')
      break
    case 'ArrowLeft':
      move('left')
      break
    case 'ArrowRight':
      move('right')
      break
  }
}
</script>

<style scoped>
.map-container {
  position: relative;
  width: calc(9 * 60px);
  margin: 20px auto;
}

/* Grille */
.grid {
  display: grid;
  grid-template-columns: repeat(9, 60px);
  grid-template-rows: repeat(4, 60px);
}

.cell {
  width: 60px;
  height: 60px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Joueur */
.player {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: crimson;
  z-index: 10;
  pointer-events: none;
  transition: transform 0.2s ease-out;
}

/* Contrôles */
.controls {
  margin-top: 10px;
}

.controls button {
  margin: 4px;
  font-size: 18px;
}
</style>
