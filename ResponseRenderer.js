class ResponseRenderer {
    render(responseData, isSelected) {
      const selectedClass = isSelected ? 'selected' : '';
        let result = '<div class="response ' + selectedClass + '" '
                        + 'id="response-' + responseData.id + '" '
                        + 'data-responseid="' + responseData.id + '">';

        result += '<div class="response-title">' + responseData.id + '</div>';
        for (const lineID of Object.keys(responseData.lines)) {
          const line = responseData.lines[lineID];
          result += this.renderLine(lineID, line);
        }

        result += '</div>';

        return result;
    }

    renderLine(ID, line) {
        return '<div class="response-line" id="line-' + ID + '">' + line.text + '</div>';
    }
}