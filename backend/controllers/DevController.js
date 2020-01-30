const axios = require("axios");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");
const { findConnectcions, sendMessage } = require("../websocket");

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },
  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    // Para saber se Dev já existe e não cadastrar Devs iguais
    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const api_response = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      // Se nome não for informado/não existir, coloque o login no lugar
      const { name = login, avatar_url, bio } = api_response.data;

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });

      // Filtrar as conexões que estão a no máximo a 10KM de distância
      // e que o novo deve tenha pela menos uma das tecnologias filtradas

      const sendSocketMessageTo = findConnectcions(
        { latitude, longitude },
        techsArray
      );

      sendMessage(sendSocketMessageTo, "newDev", dev);
    }

    return response.json(dev);
  }
};
