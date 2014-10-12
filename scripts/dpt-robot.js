/*
 * DPT-Robot javascript library version 0.1
 * (c) 2014 DPTechnics
 * Author: Daan Pape
 *
 * Requires: JQuery, dpt-board
 */

function dptr_moveForward()
{
	dpt_setIO(16, true);
	dpt_setIO(8, true);
	dpt_setIO(6, false);
	dpt_setIO(10, false);
}

function dptr_moveBackward()
{
	dpt_setIO(6, true);
	dpt_setIO(0, true);
	dpt_setIO(8, false);
	dpt_setIO(16, false);
}

function dptr_moveLeft()
{
	dpt_setIO(8, true);
	dpt_setIO(0, false);
	dpt_setIO(6, false);
	dpt_setIO(16, false);
}

function dptr_moveRight()
{
	dpt_setIO(0, true);
	dpt_setIO(6, false);
	dpt_setIO(8, false);
	dpt_setIO(16, false);
}

function dptr_stopMotor()
{
	dpt_setIO(0, false);
	dpt_setIO(6, false);
	dpt_setIO(8, false);
	dpt_setIO(16, false);
}

/*
 * Listen to document keydown events to provide action attaching. 
 */
$(document).keydown(function(e){
});

/*
 * Listen to document keyup events to provide action attaching. 
 */
$(document).keyup(function(e){
});
