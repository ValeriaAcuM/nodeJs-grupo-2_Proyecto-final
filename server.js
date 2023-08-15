const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

dotenv.config({ path: "./config.env" });

const DB = process.env.DB_CONNECTION;
mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Established");
  })
  .catch((err) => {
    console.log(err, "error en la conexion");
  });

const PokemonSchema = new mongoose.Schema({
  name: String,
  type: String,
  description: String,
  evolution: String,
  weaknesses: String,
});

const Pokemon = mongoose.model("Pokemon", PokemonSchema, "pokedex");

app.post("/pokemons", async (req, res) => {
  try {
    const pokemon = new Pokemon(req.body);
    await pokemon.save();
    res.status(201).json(pokemon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/pokemons", async (req, res) => {
  try {
    const pokemons = await Pokemon.find();
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/pokemons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Pokemon.updateOne({ _id: id }, { $set: req.body });
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

app.delete('/pokemons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Pokemon.deleteOne({ _id: id });
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server started at port 3000");
});