<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Conversation Editor</title>
    <script src="dialog_data.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.3.min.js" 
            integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" 
            crossorigin="anonymous">
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js"></script>
    <link rel="stylesheet" href="jquery-ui.min.css">
    <script src="jquery-ui.min.js"></script>
    <link href="dialogjquery.css" rel="stylesheet">
    <script src="arrow-line.min.js"></script>
    <script src="PropertyDialog.js"></script>
    <script src="Dialog.js"></script>
    <script src="Response.js"></script>

  </head>
  <body>
    <h1>Hello, world!</h1>
    <div id="overall-container">
      <div id="dialog-container">
      </div>
      
      <div id="property-editor">
        <div class="header">
          <h2 class="title">Properties</h2>
        </div>
        <div class="body">
          <div class="row">
            <label for="input-id" class="">ID</label>
            <div class="" id="input-id"></div>
          </div>
          <div class="row">
            <label for="input-speaker" class="">Speaker</label>
            <div class="">
              <select id="input-speaker">
                <option value="computer">Computer</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
          <div class="row">
            <label for="lines" class="">Lines</label>
            <div id="input-lines">
            </div>
          </div>
        </div>
        <div class="footer">
          <button type="button" class="">Save changes</button>
        </div>
      </div>
    </div>
    <div id="response-picker">
      <div id="available-responses">
      </div>
      <div id="add-new-response">
        <button type="button" id="add-new-response">Add new Response</button>
      </div>
    </div>
    <script>
      let conv;
      let propertyDlg;

      function render() {
        $('#dialog-container').html(conv.renderResponses());
        conv.renderConnections();
      }

      $(function() {
        propertyDlg = new propertyDialog(data, $('#property-editor'));
        conv = new Conversation(data, propertyDlg);
        conv.setSelectedResponse(1);
        $('#overall-container').on('click', '.response, .connection-button', function(elem) { 
          const newResponseID = $(this).data('responseid');
          conv.setSelectedResponse(newResponseID);
          render();
        });
        
        $('#property-editor').on('input', 'select, input', function() {
          propertyDlg.dirty = true;
          $(this).addClass('changed-property');
          render();
        });

        $('#property-editor').on('click', '.add-connection-button', function() {
          const lineID = $(this).data('lineid');
          const responseID = $(this).data('targetid');
          const responses = propertyDlg.getResponsePickerContents(responseID, lineID);
          $('#available-responses').html(responses);
          $('#response-picker').dialog( { modal : true });
        });

        $('#property-editor').on('click', '#add-line-button', function() {
          conv.addLine(conv.selectedResponseID);
        });

        $('#property-editor').on('click', '.connection-button-delete', function() {
          const button = $(this);
          conv.deleteConnection(button.data('lineid'), button.data('responseid'));
          render();
        });

        $('#response-picker').on('click', '.response-picker-response', function() {
          const button = $(this);
          const lineID = button.data('lineid');
          const targetResponseID = button.data('responseid');
          conv.addConnection(lineID, targetResponseID);
          conv.setSelectedResponse(targetResponseID);
          $('#response-picker').dialog('close');
          render();
        });

        render();
});
      </script>
  </body>
</html>