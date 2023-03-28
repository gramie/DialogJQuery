class Conversation {
  constructor(responseData, lineData, dialog) {
    this.data = {};
    this.parseData(responseData, lineData);)
    this.nextResponseID = this.getNextResponseID();
    this.nextLineID = this.getNextLineID();
    this.connections = {};
    this.dialog = dialog;
  }

  parseData(responseData, lineData) {
    for (const response of responseData) {
      this.data[response.id] = new Response(response.id, response.speaker, response.lines, lineData);
    }
  }

  setSelectedResponse(selectedResponseID) {
    this.dialog.saveResponse(this.selectedResponseID);
    this.selectedResponseID = selectedResponseID;
    this.dialog.setSelectedResponse(selectedResponseID);
  }

  renderResponses() {
    const responseRenderer = new ResponseRenderer();
    let userResponses = '<div class="responses user-responses">';
    let computerResponses = '<div class="responses computer-responses">';
    for (const response of Object.values(this.data)) {
      const isSelected = (response.id == this.selectedResponseID);
      let responseHTML = '<div class="responses-speaker">';
      responseHTML += responseRenderer.render(response, isSelected) + "\n";
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
      for (const lineID of Object.keys(response.lines)) {
        if (!parseInt(lineID)) {
          continue;
        }
        const line = response.lines[lineID];
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
      const newResponse = this.createResponse();
      this.data[newResponse.id] = newResponse;
      responseID = parseInt(newResponse.id);
    }

    line.connections.push(responseID);

    return responseID;
  }

  findLine(lineID) {
    for (const response of Object.values(this.data)) {
      if (response.lines[lineID]) {
        return response.lines[lineID];
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

  createResponse() {
    return {
      id : this.getNextResponseID(),
      speaker: 'computer',
      lines: []
    };
  }

  getNextResponseID() {
    const keys = Object.keys(this.data).map(x => parseInt(x)).sort(function(a, b){return a-b});
    return keys.pop() +1;
  }

  getNextLineID() {
    const lineIDs = [];
    for (const response of Object.values(this.data)) {
      lineIDs.push(...Object.keys(response.lines));
      lineIDs.sort(function(a, b){return a-b});
    }

    return parseInt(lineIDs.pop()) +1;   
  }

  addLine(responseID) {
    const newLine = {
      text: "",
      audio_filename: "",
      translation: "",
      connections: []
    };
    this.data[responseID].lines[this.getNextLineID()] = newLine;
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
      if (response.lines[lineID]) {
        const line = response.lines[lineID];
        const targetIndex = line.connections.indexOf(targetResponseID);
        if (targetIndex > -1) {
          line.connections.splice(targetIndex, 1);
        }
        break;
      }
    }
  }
}