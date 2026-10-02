
/*
Command Pattern wraps an action in an object. The remote only knows to call  execute() ; it does not know how the TV turns on or off. This decouples the button that requests an action from the object that performs it.

Example: A memorable Command Pattern example is a TV remote control.
• Remote = invoker (button presser)
• Command = action object ( TurnOnTVCommand )
• TV = receiver (does the actual work)
*/

class TV {
  turnOn() {
    console.log("TV is ON");
  }

  turnOff() {
    console.log("TV is OFF");
  }
}

class TurnOnTVCommand {
  constructor(tv) {
    this.tv = tv;
  }

  execute() {
    this.tv.turnOn();
  }
}

class TurnOffTVCommand {
  constructor(tv) {
    this.tv = tv;
  }

  execute() {
    this.tv.turnOff();
  }
}

class RemoteControl {
  setCommand(command) {
    this.command = command;
  }

  pressButton() {
    this.command.execute();
  }
}

// Usage
const tv = new TV();
const remote = new RemoteControl();

remote.setCommand(new TurnOnTVCommand(tv));
remote.pressButton(); // TV is ON

remote.setCommand(new TurnOffTVCommand(tv));
remote.pressButton(); // TV is OFF
