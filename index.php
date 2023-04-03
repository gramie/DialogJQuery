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
    <link rel="stylesheet" href="jquery-ui.min.css">
    <link rel="stylesheet" href="dialogjquery.css">
    <script src="jquery-ui.min.js"></script>
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
      <div>
        <button type="button" 
                id="add-new-response" 
                class="response-picker-response"
                data-lineid="">Add new Response</button>
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
        propertyDlg = new propertyDialog($('#property-editor'));
        conv = new Conversation(responseData, lineData, propertyDlg);
        conv.setSelectedResponse(1);
        
        // Click on a Response
        $('#overall-container').on('click', '.response', function(elem) { 
          const newResponseID = $(this).data('responseid');
          conv.setSelectedResponse(newResponseID);
          render();
        });

        // Click on a "Go to Response" button
        $('#overall-container').on('click', '.connection-button', function(elem) { 
          const newResponseID = $(this).data('targetid');
          conv.setSelectedResponse(newResponseID);
          render();
        });

        // Change a property
        $('#property-editor').on('input', 'select, input', function() {
          propertyDlg.dirty = true;
          $(this).addClass('changed-property');
          render();
        });

        // Click "Add Connection" button
        $('#property-editor').on('click', '.add-connection-button', function() {
          const lineID = $(this).data('lineid')
          const possibleResponses = conv.getAvailableResponses(lineID);
          const responses = propertyDlg.getResponsePickerContents(lineID, possibleResponses);
          $('#available-responses').html(responses);
          $('#add-new-response').data('lineid', lineID);
          $('#response-picker').dialog( { modal : true });
        });

        // Click "Add Line" button
        $('#property-editor').on('click', '#add-line-button', function() {
          conv.addLine();
          render();
        });

        // Click "Delete Connection" button
        $('#property-editor').on('click', '.connection-button-delete', function() {
          const button = $(this);
          conv.deleteConnection(button.data('lineid'), button.data('targetid'));
          render();
          conv.setSelectedResponse();
        });

        // Click a target Response from the Response picker
        $('#response-picker').on('click', '.response-picker-response', function() {
          const button = $(this);
          const lineID = button.data('lineid');
          const targetResponseID = button.data('responseid');
          conv.addConnection(lineID, targetResponseID);
          $('#response-picker').dialog('close');
          render();
        });

        render();
});
      </script>
  </body>
</html>