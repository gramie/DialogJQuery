class propertyDialog {
  constructor(data, dialogDOM) {
    this.data = data;
    this.dialog = dialogDOM;
    this.dirty = false;
  }
  
  setSelectedResponse(responseID, setDirty = false) {
    this.displayResponse(responseID);
    if (setDirty) {
      this.dirty = true;
    }
  }

  saveResponse(responseID) {
    if (!this.dirty) {
      return;
    }
    const response = this.data[responseID];
    this.data[responseID].lines.length = 0;
    response.speaker = this.dialog.find('#input-speaker').val();

    var props = Object.getOwnPropertyNames(response.lines);
    for (var i = 0; i < props.length; i++) {
      delete response.lines[i];
    }
    for (const line of this.dialog.find('.line-properties')) {
      const lineContainer = $(line);
      console.log(lineContainer);
      const lineID = lineContainer.data('lineid');
      const connections = [];
      lineContainer.find('.connection-button[data-targetid]').each(function() {      
        connections.push($(this).data('targetid'));
      });
      const newLine = {
        text: lineContainer.find('.line-text input').val(),
        audio_filename: lineContainer.find('.line-audio input').val(),
        translation: lineContainer.find('.line-translation input').val(),
        connections: connections
      };
      this.data[responseID].lines[lineID] = newLine;
    }
  }
  
  displayResponse(selectedResponseID) {
    const response = this.data[selectedResponseID];
    this.dialog.find('#input-id').html(selectedResponseID);  
    this.dialog.find('#input-speaker').val(response.speaker);
    let lineHTML = '';
    for (const lineID of Object.keys(response.lines)) {
      if (!parseInt(lineID)) {
        continue;
      }
      const line = response.lines[lineID];
      
      lineHTML += '<div class="line-properties" data-lineid="' + lineID + '">' + this.getLineHTML(selectedResponseID, lineID, line) + '</div>';
    }
    lineHTML += '<div class="add-line"><button type="button" id="add-line-button">Add line</div>';
    this.dialog.find('#input-lines').html(lineHTML);
    
    this.dialog.find('input, select').removeClass('changed-property');
  }

  getLineHTML(currentResponseID, lineID, line) {
    let result = '';
    result += '<div class="label">Text</div>'
            + '<div class="line-text">'
            + '<input type="text" value="' + line.text + '" />'
            + '</div>';
    result += '<div class="label">Audio URL</div>'
            + '<div class="line-audio">'
            + '<input type="text" value="' + line.audio_filename + '" />'
            + '</div>';
    result += '<div class="label">Translation</div>'
            + '<div class="line-translation">'
            + '<input type="text" value="' + line.translation + '" />'
            + '</div>';
    result += '<div class="label">Connections</div>'
            + '<div class="line-connections">';
    for (const targetResponse of line.connections) {
      result += '<div><button type="button" class="connection-button" data-targetid="' + targetResponse + '">' 
              + targetResponse + '</button>'
              + '<button type="button" '
              + 'class="connection-button-delete" '
               + 'data-lineid="' + lineID + '" '
              + 'data-responseid="' + targetResponse + '">'
              + 'x</button></div>';
    }
    result += '</div>';
    result += '<button type="button" class="add-connection-button" '
               + 'data-lineid="' + lineID + '" '
               + 'data-targetid="' + currentResponseID + '">+</button>';

    return result;
  }

  getResponsePickerContents(currentResponseID, lineID) {
    let result = '';
    const existingConnectionIDs = Object.values(this.data[currentResponseID].lines[lineID].connections);
    existingConnectionIDs.push(currentResponseID);
    
    for (const response of Object.values(this.data)) {
      if (existingConnectionIDs.indexOf(parseInt(response.id)) == -1) {
        const firstLine = Object.values(response.lines).shift();
        result += '<div><button class="response-picker-response" '
                     + 'data-lineid="' + lineID + '" '
                     + 'data-responseid="' + response.id + '">'
                     + response.id + ': ' + firstLine.text 
                     + '</button></div>';
      }
    }
    
    result += '</div>';

    return result;
  }
}
