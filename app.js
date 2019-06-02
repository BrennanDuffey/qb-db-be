import express from 'express';
import cors from 'cors';
const { tossups } = require('./tossups.js');

const app = express();



app.use(cors());
app.use(express.json());

app.locals.tossups = tossups

app.get('/api/v1/tossups', (request, response) => {
  const randomNum = Math.floor(Math.random() * 735)
  const tossups = [...app.locals.tossups].splice(randomNum, 15)
  return response.status(200).json({ tossups })
});

app.get('/api/v1/tossups/:category/:difficulty/:count', (request, response) => {
  const categoryIds = request.params.category
    .split('&').map(categoryId => (parseInt(categoryId)));
  const difficultyIds = request.params.difficulty
    .split('&').map(difficultyId => (parseInt(difficultyId)));
  const count = request.params.count;


  let filteredTossups = [];
  app.locals.tossups.forEach(tossup => {
    if (categoryIds.includes(tossup.category.id)) {
      filteredTossups.push(tossup);
    }
  })

  filteredTossups = filteredTossups.filter(tossup => difficultyIds.includes(tossup.tournament.difficulty_num))

  const randomNum = Math.floor(Math.random() * (filteredTossups.length - count))
  const tossups = filteredTossups.splice(randomNum, count)
  if (!tossups.length) {
    return response.status(404).json({ error: 'No tossups found'})
  }
  return response.status(200).json({ tossups });
})

export default app;