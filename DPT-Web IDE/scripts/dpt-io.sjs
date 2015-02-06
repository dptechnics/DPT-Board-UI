function moveForward(time) {
    console.log('Robot moving forward for: ' + (time * 100) + 'ms');
    dptr_moveForward();
    hold(100 * time);
    dptr_stopMotor();
}

function moveBackward(time) {
    console.log('Robot moving backward for: ' + time * 100 + 'ms');
    dptr_moveBackward();
    hold(100 * time);
    dptr_stopMotor();
}

function moveLeft(time) {
    console.log('Robot moving left for: ' + time * 100 + 'ms');
    dptr_moveLeft();
    hold(100 * time);
    dptr_stopMotor();
}

function moveRight(time) {
    console.log('Robot moving right for: ' + time * 100 + 'ms');
    dptr_moveRight();
    hold(100 * time);
    dptr_stopMotor();
}

function spinRight() {
    console.log('Robot spinning right');
    dptr_spinRight();
    hold(200);
    dptr_stopMotor();
}

function spinLeft() {
    console.log('Robot spinning left');
    dptr_spinLeft();
    hold(200);
    dptr_stopMotor();
}