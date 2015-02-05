/* 
 * Authors: Matthieu Calie, Daan Pape
 * This file contains the custom blocks for blockly to power the DPT-Robot module
 */

/*
 * Custom Block 1 : Robot forward moving
 * https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#vao53d
 */
Blockly.Blocks['robot_move'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(210);
    this.appendValueInput("MOVE")
        .setCheck("Number")
        .appendField("Move robot")
        .appendField(new Blockly.FieldDropdown([["Forward", "UP"], ["Backward", "DOWN"], ["Left", "LEFT"], ["Right", "RIGHT"]]), "DIRECTION")
        .appendField("For");
    this.appendDummyInput()
        .appendField(" * 100 ms");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Blockly.JavaScript['robot_move'] = function(block) {
  var value_move = Blockly.JavaScript.valueToCode(block, 'MOVE', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_direction = block.getFieldValue('DIRECTION');
  // TODO: Assemble JavaScript into code variable.
  var code;
  switch (dropdown_direction) {
      case "UP":
          code = "moveForward(" + value_move + ");";
          break;
      case "DOWN":
          code = "moveBackward(" + value_move + ");";
          break;
      case "LEFT":
          code = "moveLeft(" + value_move + ");";
          break;
      case "RIGHT":
          code = "moveRight(" + value_move + ");";
          break;
      default:
          code = "waiting for input";          
  }
  code += "\n"
  return code;
};

Blockly.JavaScript['text_print'] = function(block) {
  // Print statement.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'TEXT',
      Blockly.JavaScript.ORDER_NONE) || '\'\'';
  return 'console.log(' + argument0 + ');\n';
};


