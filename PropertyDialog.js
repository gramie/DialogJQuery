class propertyDialog {
  constructor(dialogDOM) {
    this.dialog = dialogDOM;
    this.dirty = false;
  }
  
  setSelectedResponse(response, setDirty = false) {
    this.displayResponse(response);
    if (setDirty) {
      this.dirty = true;
    }
  }

  saveResponse(response) {
    if (!this.dirty) {
      return;
    }
    response.lines.clear();
    response.speaker = this.dialog.find('#input-speaker').val();

    for (const line of this.dialog.find('.line-properties')) {
      const lineContainer = $(line);
      const lineID = lineContainer.data('lineid');
      const connections = [];
      lineContainer.find('.connection-button[data-targetid]').each(function() {      
        connections.push($(this).data('targetid'));
      });
      const newLine = {
        text: lineContainer.find('.line-text input').val(),
        audioURL: lineContainer.find('.line-audio input').val(),
        translation: lineContainer.find('.line-translation input').val(),
        connections: connections
      };
      response.lines.set(lineID, new ResponseLine(lineID, newLine));
    }
  }
  
  displayResponse(response) {
    this.dialog.find('#input-id').html(response.id);
    this.dialog.find('#delete-response').data('data-deleteresponseid', response.id);
    this.dialog.find('#input-speaker').val(response.speaker);
    let lineHTML = '';
    for (const [lineID, line] of response.lines) {
      
      lineHTML += '<div class="line-properties" data-lineid="' + lineID + '">' + this.getLineHTML(response.id, lineID, line) + '</div>';
    }
    lineHTML += '<div class="add-line"><button type="button" id="add-line-button" data-responseid="' + response.id + '">Add line</div>';
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
            + '<input type="text" value="' + line.audioURL + '" />'
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
              + 'data-targetid="' + targetResponse + '">'
              + 'x</button></div>';
    }
    result += '</div>';
    result += '<button type="button" class="add-connection-button" '
               + 'data-lineid="' + lineID + '">+</button>';

    return result;
  }

  getResponsePickerContents(lineID, availableResponses) {
    let result = '';
    for (const response of availableResponses) {
      const lines = response.lines;
      
      const firstLine = lines.values().next().value;
      result += '<div><button class="response-picker-response" '
                   + 'data-lineid="' + lineID + '" '
                   + 'data-responseid="' + response.id + '">'
                   + response.id + ': ' + firstLine.text 
                   + '</button></div>';
    }
    
    result += '</div>';

    return result;
  }
}
