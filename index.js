const fs = require("fs");
const stringify = require("csv-stringify");

const json = {};
const root = "playlists";
const folders = fs.readdirSync(`./${root}`);

for (const folder of folders) {
  const readFolder = `./${root}/${folder}`;

  const songFolders = fs
    .readdirSync(readFolder)
    .sort((a, b) => +a.split(".")[0] - +b.split(".")[0]);

  json[folder] = {
    name: folder,
    songs: [],
  };

  for (const songFolder of songFolders) {
    const songFiles = fs.readdirSync(`${readFolder}/${songFolder}`);
    const songRecord = {
      image: "",
      songFile: "",
      name: songFolder.split(" ").slice(1).join(" ").trim(),
    };
    for (const fil of songFiles) {
      const imageFormats = ["png", "jpeg", "webp", "PNG", "JPEG", "WEBP"];
      if (imageFormats.includes(fil.split(".").at(-1))) {
        songRecord.image = `${readFolder}/${fil}`;
      } else {
        songRecord.songFile = `${readFolder}/${fil}`;
      }
    }
    json[folder].songs.push(songRecord);
  }
}

const columns = {
  id: "id",
  title: "title",
  artwork: "artwork",
  mp3: "mp3",
};

for (const category in json) {
  stringify.stringify(
    json[category].songs.map((song, index) => [
      +index + 1,
      song.name,
      song.image,
      song.songFile,
    ]),
    { header: true, columns },
    (err, output) => {
      if (err) throw err;
      const filePath = `./csvs/${category}.csv`;
      fs.writeFileSync(filePath, output);
      console.log(`${filePath} saved.`);
    }
  );
}
