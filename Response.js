class Response {
  constructor(id, speaker, lineIDs, allLines) {
    this.id = id;
    this.speaker = speaker;
    this.lines = new Map();
    for (const lineID of lineIDs) {
      const inputLine = allLines[lineID];
      
      this.addLine(lineID, new ResponseLine(lineID, inputLine.text, inputLine.audioURL,
                                            inputLine.translation, inputLine.connections));
    }
  }

  addLine(id, text, audioURL, translation, connections) {
      this.lines.set(lineID, new ResponseLine(lineID, inputLine.text, inputLine.audioURL,
                                             inputLine.translation, inputLine.connections));
  }

  removeLine(id) {
    this.lines.delete(id);
  }

  clearLines() {
    this.lines.clear();
  }
}

class ResponseLine {
  constructor(id, text, audioURL, translation, connections) {
    this.id = id;
    this.text = text;
    this.audioURL = audioURL;
    this.translation = translation;
    this.connections = connections;
  }
}