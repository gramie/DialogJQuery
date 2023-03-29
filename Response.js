class Response {
  constructor(id, speaker, lineIDs, allLines) {
    this.id = id;
    this.speaker = speaker;
    this.lines = new Map();
    for (const lineID of lineIDs) {
      const inputLine = allLines[lineID];
      
      this.addLine(lineID, new ResponseLine(lineID, inputLine));
    }
  }

  addLine(lineID, inputLine) {
      this.lines.set(lineID, new ResponseLine(line.id, inputLine));
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
      line.addConnection(targetResponse);
    } else {
      console.log("Response" + this.id + " does not have line with ID " + lineID);
    }
  }

  removeConnection(lineID, targetResponseID) {
    if (this.lines.has(lineID)) {
      const line = this.lines.get(lineID);
      line.addConnection(targetResponseID);
    } else {
      console.log("Response" + this.id + " does not have line with ID " + lineID);
    }    
  }

  render(isSelected = false) {
    const selectedClass = isSelected ? 'selected' : '';
    let result = '<div class="response ' + selectedClass + '" '
                    + 'id="response-' + this.id + '" '
                    + 'data-responseid="' + this.id + '">';

    result += '<div class="response-title">' + this.id + '</div>';
    for (const line in Object.values(this.lines)) {
      result += line.render();
    }

    result += '</div>';

    return result;
  }

  }
}

class ResponseLine {
  constructor(id, lineData) {
    this.id = lineData.id;
    this.text = lineData.text;
    this.audioURL = lineData.audioURL;
    this.translation = lineData.translation;
    this.connections = lineData.connections;
  }

  addConnection(targetResponseID) {
    if (this.connections.indexOf(targetResponseID) < 0) {
      this.connections.push(targetResponseID);
    } else {
      console.log("Line " + this.id
                  + "does not have a connection to " + targetResponseID);
    }
  }
  
  removeConnection(targetResponseID) {
      const targetIndex = this.connections.indexOf(targetResponseID);
      if (targetIndex >= 0) {
        this.connections.splice(targetIndex, 1);
      } else {
        console.log("Line " + this.id
                    + "does not have a connection to " + targetResponseID);
      }    
  }

  render() {
    return '<div class="response-line" id="line-' + this.id + '">' + this.text + '</div>';
  }

}