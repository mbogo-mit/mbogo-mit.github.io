
var MQ = MathQuill.getInterface(2); // keeps the API stable


function CreateNewMathField(id){
  //el is a jquery Element
  var m = MQ.MathField(document.getElementById(id), {
    spaceBehavesLikeTab: false,
    restrictMismatchedBrackets: true,
    sumStartsWithNEquals: true,
    supSubsRequireOperand: true,
    autoCommands: `sqrt prod sum int hat ${LatexGreekLetters.join(' ').replace(/\s\\psi/g,"").replace(/\\/g,"")}`,
    autoOperatorNames: 'lim sin sinh arcsin arcsinh cos cosh arccos arccosh tan tanh arctan arctanh cot coth arccot arccoth csc csch arccsc arccsch sec sech arcsec arcsech log ln',
    charsThatBreakOutOfSupSub: '+-=<>',
    handlers: {
      edit: function() {
          if(!EditingMathFields){
            LastVariableRIDChangedToGiven = null;//this tells the variable collection to not try to select a math field for variable value because the user is currently typing in the editor
            UpdateLineLabelHeight(id);
            EL.GenerateEditorErrorMessages();
            CheckIfAutoGeneratedVariablesAreBeingUsed();
            DisablePhysicsConstantCheckboxesThatAreBeingUsed();
          }

      },
      enter: function(){
        MathFieldKeyPressEnter($(`#${id}`).parents(".editor_line"), true);
      },
      moveOutOf: function(dir, mathField) {
        //tagging variables may cause this event to fire by accident so we need to make sure that the event was not fire because of the processes that occur while tagging a variable
        if (dir === MQ.R){
          MoveCursor1Line(mathField.el().id, "down","right");
        }
        else if(dir === MQ.L){
          MoveCursor1Line(mathField.el().id, "up","left");
        }
      },
      downOutOf: function(mathField) {
        MoveCursor1Line(mathField.el().id, "down", "down");
      },
      upOutOf: function(mathField){
        MoveCursor1Line(mathField.el().id, "up", "up");
      },
      deleteOutOf: function(dir, mathField){
        DeleteCurrentMathFieldAndCopyContentIntoPreviousMathField(mathField.el().id);
      }
    }
  });

  MathFields[id] = {mf:m, message: {
    question: null,//is this variable a physics constant
    warning: null,//variable undefined,
    error: null, //units don't match
  }, log: {
    warning: [], error: []
  }
  };

  BlurMathFields();
  MathFields[id].mf.focus();

  UpdateLineLabelHeight(id);

  FocusedMathFieldId = id;
  SetMathFieldsUI();

  //AddLineLabelHoverEvent(id);

}
