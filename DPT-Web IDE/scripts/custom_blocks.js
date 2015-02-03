/* 
 * Authors: Matthieu Calie, Daan Pape
 * This file contains the custom blocks for blockly to power the DPT-Robot module
 */

/*
 * Custom Block 1 : Robot forward moving
 * https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#56vngq
 */
Blockly.Blocks['robot_move'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(210);
    this.appendValueInput("MOVE")
        .setCheck("Number")
        .appendField("Move robot")
        .appendField(new Blockly.FieldDropdown([["Up", "UP"], ["Down", "DOWN"], ["Left", "LEFT"], ["Right", "RIGHT"]]), "DIRECTION")
        .appendField("For");
    this.appendDummyInput()
        .appendField("steps");
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
          code = "moveup(" + value_move + ");";
          break;
      case "DOWN":
          code = "movedown(" + value_move + ");";
          break;
      case "LEFT":
          code = "moveleft(" + value_move + ");";
          break;
      case "RIGHT":
          code = "moveright(" + value_move + ");";
          break;
      default:
          code = "waiting for input";          
  }
  code += "\n"
  return code;
};

