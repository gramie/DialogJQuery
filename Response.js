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

  addConnection(lineID, targetResponse) {
    if (this.lines.has(lineID)) {
      const line = this.lines.get(lineID);
      if (line.connections.indexOf(targetResponse) < 0) {
        line.connections.push(targetResponse);
      } else {
        console.log("Response" + this.id + ", Line " + lineID
                    + "does not have a connection to " + targetResponse);
      }
    } else {
      console.log("Response" + this.id + " does not have line with ID " + lineID);
    }
  }

  removeConnection(lineID, targetResponse) {
    if (this.lines.has(lineID)) {
      const line = this.lines.get(lineID);
      const targetIndex = line.connections.indexOf(targetResponse);
      if (targetIndex >= 0) {
        line.connections.splice(targetIndex, 1);
      } else {
        console.log("Response" + this.id + ", Line " + lineID
                    + "does not have a connection to " + targetResponse);
      }
    } else {
      console.log("Response" + this.id + " does not have line with ID " + lineID);
    }    
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