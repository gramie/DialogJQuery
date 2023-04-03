class Conversation {
  constructor(responseData, lineData, dialog) {
    this.data = {};
    this.lineData = null;
    this.parseData(responseData, lineData);
    this.nextResponseID = this.getNextResponseID();
    this.nextLineID = this.getNextLineID();
    this.connections = {};
    this.dialog = dialog;
  }

  parseData(responseData, lineData) {
    this.lineData = lineData;
    for (const response of responseData) {
      this.data[response.id] = new Response(response.id, response.speaker, response.lines, lineData);
    }
  }

  setSelectedResponse(newResponseID = null) {
    this.dialog.saveResponse(this.data[this.selectedResponseID]);
    if (newResponseID) {
      this.selectedResponseID = newResponseID;
    }
    this.dialog.setSelectedResponse(this.data[this.selectedResponseID]);
  }

  getAvailableResponses(lineID) {
    const result = [];
    
    const existingTargets = this.data[this.selectedResponseID].lines.get(lineID).connections;
    const existingConnectionIDs = [...existingTargets, this.selectedResponseID];

    for (const responseID of Object.keys(this.data)) {
      if (existingConnectionIDs.indexOf(parseInt(responseID)) == -1) {
        result.push(this.data[responseID]);
      }
    }

    return result;
  }

  renderResponses() {
    let userResponses = '<div class="responses user-responses">';
    let computerResponses = '<div class="responses computer-responses">';
    for (const response of Object.values(this.data)) {
      const isSelected = (response.id == this.selectedResponseID);
      let responseHTML = '<div class="responses-speaker">';
      responseHTML += response.render(isSelected) + "\n";
      responseHTML += '</div>';
      if (response.speaker === 'computer') {
        computerResponses += responseHTML;
      } else {
        userResponses += responseHTML;
      }
    }

    userResponses += '</div>';
    computerResponses += '</div>';
    return userResponses + computerResponses;
  }

  clearConnections() {
    for (const arrow of Object.values(this.connections)){
      arrow.remove();
    }
    this.connections = {};
  }

  renderConnections() {
    this.clearConnections();
    for (const response of Object.values(this.data)) {
      for (const [lineID, line] of response.lines) {
        for (let idx = 0; idx < line.connections.length; idx++) {
          const target = line.connections[idx];
          const sourcePosition = response.speaker === 'computer'
            ? 'middleLeft' : 'middleRight';
          const destinationPosition = response.speaker === 'computer'
            ? 'topRight' : 'topLeft';
          const lineOptions = {
            sourcePosition: sourcePosition,
            destinationPosition: destinationPosition,
            thickness: 2,
            style: 'dash',
            endpoint: { type: 'arrowHead', size: 0.5 },
            color: 'silver'
          };
          if (target == this.selectedResponseID || response.id == this.selectedResponseID) {
            lineOptions.color = target == this.selectedResponseID ? 'green' : 'red';
            lineOptions.thickness = 3;
            lineOptions.style = 'solid';
          }

          this.connections['arrow-' + lineID + '-' + target] = arrowLine('#line-' + lineID, '#response-' + target, lineOptions);
        }
      }
    }
  }

  addConnection(fromLineID, toResponseID = null) {
    const line = this.findLine(fromLineID);

    let responseID;
    if (toResponseID) {
      responseID = parseInt(toResponseID);
    } else {
      const newResponse = new Response(this.getNextResponseID(), 'computer', [], this.lineData);
      this.data[newResponse.id] = newResponse;
      responseID = parseInt(newResponse.id);
    }

    line.connections.push(responseID);
    this.setSelectedResponse(responseID);
    return responseID;
  }

  findLine(lineID) {
    for (const response of Object.values(this.data)) {
      if (response.lines.has(lineID)) {
        return response.lines.get(lineID);
      }
    }

    return null;
  }

  findResponseForLine(lineID) {
    for (const response of Object.values(this.data)) {
      if (response.lines[lineID]) {
        return response;
      }
    }

    return null;
  }

  getNextResponseID() {
    const keys = Object.keys(this.data).map(x => parseInt(x)).sort(function(a, b){return a-b});
    return keys.pop() +1;
  }

  getNextLineID() {
    const lineIDs = [];
    for (const response of Object.values(this.data)) {
      lineIDs.push(...response.lines.keys());
    }
    lineIDs.sort(function(a, b){return a-b});

    return parseInt(lineIDs.pop()) +1;   
  }

  addLine() {
    const newLineID = this.getNextLineID();
    const newLine = new ResponseLine(newLineID, {
      text: "",
      audioURL: "",
      translation: "",
      connections: []
    });
    this.data[this.selectedResponseID].lines.set(newLineID, newLine);
    this.dialog.displayResponse(this.data[this.selectedResponseID]);
  }

  /** 
    Get all the connections that match the "from" lineID and the "to" responseID
    They are links between Lines and the Connections of those lines
  */
  getConnections(sourcelineID = null, targetResponseID = null) {
    const result = {};

    const linesFound = {};
    for (const response of Object.values(this.data)) {
      if (sourcelineID) {
        // we are looking for a single line
        if (response.lines[sourcelineID]) {
          linesFound[sourcelineID] = response.lines[sourcelineID].connections;
          break;
        }
      } else {
        // we are looking for any lines
        if (Object.keys(response.lines).length > 0) { 
          for (const lineID of Object.keys(response.lines))
            linesFound[lineID] = response.lines[lineID];
        }
      }
    }

    if (targetResponseID) {
      for (const lineID of Object.keys(linesFound)) {
        if (linesFound[lineID].connections.indexOf(targetResponseID) > -1) {
          result[lineID] = [targetResponseID];
        }
      }
  
      return result;
    } else {
      return linesFound;
    }

  }

  deleteLine(lineID) {
     for (const response of Object.values(this.data)) {
      if (response.lines[lineID]) {
        delete response.lines[lineID];
        break;
      }
    }
  }

  deleteConnection(lineID, targetResponseID) {
     for (const response of Object.values(this.data)) {
      if (response.lines.has(lineID)) {
        const line = response.lines.get(lineID);
        const targetIndex = line.connections.indexOf(targetResponseID);
        if (targetIndex > -1) {
          line.connections.splice(targetIndex, 1);
        }
        break;
      }
    }
  }
}