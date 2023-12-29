const page = {
    code: document.getElementById("code"),
    stdin: document.getElementById("stdin"),
    stdout: document.getElementById("stdout"),
}

function isNumber(char){
    return char >= '0' && char <= '9';
}

const instructions = {
    instructionTypes:[
        "nulloperation",
        "variabledeclaration",
        "change",
        "functiondeclaration",
        "call",
    ],
    "int": {
        type: 1,
        asm: "int",
        func: function(instruction){
            let ret = "int " + instruction[1];
            if (instruction[2] == "=") {
                if (isNumber(instruction[3][0]))
                    return ret + " " + instruction[3];
                else return ret + " 00000\ncpy " + instruction[3] + " " + instruction[1];
            }
            else return ret;
        }
    },
    "bool": {
        type: 1,
        asm: "bool"
    },
    "fn":
}

const stdout = {
    print: function (text) {
        text = text.replaceAll("\n", "<br>");
        page.stdout.innerHTML += '<div class="stdprint"><code>' + text + '</code></div>';
    },
    error: function (error) {
        error = error.replaceAll("\n", "<br>");
        page.stdout.innerHTML += '<div class="stderror"><code>' + error + '</code></div>';
    },
}

function codeOnResize() { // NOT WORKING
    page.stdin.style.width = document.body.style.width - page.code.style.width;
    page.stdout.style.width = document.body.style.width - page.code.style.width;
    console.log(page.stdin.style.width);
}

const filesystem = { // Should be in os but initialization shiet
    fileNames: [
        "gcc"
    ],
    commands: {
        "ls": function () {
            let str = "";
            for (let i = 0; i < fileNames.length; i++) {
                str = str + " " + filesystem.fileNames[i];
            }
            stdout.print(str);
        }
    }
};

const os = {
    commands: {
        "build": compile,
        "ls": filesystem.commands.ls,
    },
    savedCommands: [],
    currentSavedCommand: 0
}

function compile() {
    //-----CODE FORMATTING----- => REMOVE DOUBLE SPACE AND NEWLINE BUG
    let code = page.code.value;
    code = code.split("\n");
    for (let i = 0; i < code.length; i++){
        code[i] = code[i].split(" ");
    }
    //-----COMPILING INSTRUCTIONS-----
    let asm = "";
    for (let i = 0; i < code.length; i++){
        asm += instructions[code[i][0]].func(code[i]) + "\n";
    }
    stdout.print(asm);
}

function OSBehaviour(command) {
    if (os.commands[command] != undefined) {
        stdout.print(command);
        os.commands[command]();
    }
    else
        stdout.error('Command "' + command + '" not found!');
}

let currentStdinFunction = OSBehaviour;

page.stdin.addEventListener("keydown", function (event) {
    //event.preventDefault();
    if (event.key === "Enter") {
        console.log('Current command: "' + page.stdin.value + '"');
        currentStdinFunction(page.stdin.value);
    }
});

page.stdin.addEventListener("keyup", function (event) {
    //event.preventDefault();
    if (event.key === "Enter") {
        os.savedCommands.unshift(page.stdin.value.replace('\n', ''));
        page.stdin.value = "";
    } else if (event.key === "ArrowUp"){
        if (os.currentSavedCommand != os.savedCommands.length - 1) os.currentSavedCommand++;
        page.stdin.value = os.savedCommands[os.currentSavedCommand];
    } else if (event.key === "ArrowDown"){
        if (os.currentSavedCommand != 0) os.currentSavedCommand--;
        page.stdin.value = os.savedCommands[os.currentSavedCommand];
    }
});

function loadTestCode() {
    page.code.value = 
`int x = 123
int y = x`;
}

document.onload = loadTestCode();