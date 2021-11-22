import NextApiRouter from "next-api-router";
import { v4 as uuidv4 } from "uuid";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

const adapter = new FileSync("db.json");
const db = low(adapter);

const getPlayer = (signature) => {
  const signatures = db.get("signatures");
  const players = db.get("players");
  const signatureModel = signatures.find({ signature }).value();

  console.log(signatureModel);

  if (signatureModel) {
    const player = players.find({ id: signatureModel.player }).value();

    return player;
  }

  return null;
};

const getRandomInteger = (min, max) => {
  return Math.round(Math.random() * (max - min)) + min;
};

const pick = (bucket) => {
  const randomIndex = getRandomInteger(0, bucket.length - 1);

  return bucket.splice(randomIndex, 1)[0];
};

function matchUp(playersArray) {
  const bucket = [...playersArray].sort(() => Math.random() - 0.5);

  return playersArray.map((player) => {
    let receiver = pick(bucket);

    while (
      receiver.name === player.name ||
      player.preventMatchFor.includes(receiver.id)
    ) {
      bucket.push(receiver);
      bucket.sort(() => Math.random() - 0.5);
      receiver = pick(bucket);
    }

    return {
      buyerId: player.id,
      receiverId: receiver.id
    };
  });
}

export default (req, res) => {
  const Router = new NextApiRouter(req, res);

  Router.post("/signatures", (req, res) => {
    const { body } = req;
    const players = db.get("players");
    const signatures = db.get("signatures");

    console.log(signatures.value());

    const id = JSON.parse(body).id;
    const player = players.find({ id }).value();

    if (!player) {
      res.status(404).json({ message: "User does not exsist!" });
      return;
    }

    const signature = signatures.find({ player: player.id }).value();

    if (signature) {
      res.status(403).json({ message: "This user is already clamed!" });
      return;
    }

    const newSignature = {
      player: player.id,
      signature: uuidv4()
    };

    signatures.push(newSignature).write();

    res.status(200).json(newSignature);
  });

  Router.get("/users/me", (req, res) => {
    const { signature } = req.query;

    const player = getPlayer(signature);

    if (player) {
      res.status(200).json(player);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });

  Router.get("/players", (req, res) => {
    const players = db.get("players").value();
    const signatures = db.get("signatures");

    const computedPlayers = players?.map((player) => {
      const isClaimed = signatures.find({ player: player.id }).value();

      return {
        ...player,
        isClaimed: Boolean(isClaimed)
      };
    });

    if (computedPlayers) {
      res.status(200).json(computedPlayers);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });

  Router.get("/match", (req, res) => {
    const { signature } = req.query;

    const player = getPlayer(signature);

    if (player) {
      const matches = db.get("matches");
      const match = matches.find({ buyerId: player.id }).value();

      if (match) {
        res.status(200).json(match);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });

  Router.post("/match", (req, res) => {
    const { signature } = req.query;

    const player = getPlayer(signature);

    if (player) {
      const players = db.get("players").value();
      db.set("matches", matchUp(players)).write();
      const matches = db.get("matches");

      const match = matches.find({ buyerId: player.id }).value();
      res.status(200).json(match);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });

  Router.post("/reset", (req, res) => {
    const { signature } = req.query;

    const player = getPlayer(signature);

    if (player?.isAdmin) {
      db.set("matches", []).write();
      db.set("signatures", []).write();
      res.status(200).json({ status: "done" });
    } else {
      res.status(403).json({ message: "Action not allowed!" });
    }
  });

  return Router.routes();
};
