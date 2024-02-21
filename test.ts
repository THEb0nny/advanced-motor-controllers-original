// Внутри цикла не надо ничего выводить в консоль или печатать на экран, поведение робота становится хуже!

function Example51() {
    advmotctrls.SyncConfig(0.08, 50, 50);
    while (true) {
        control.timer1.reset();
        let encB = Math.abs(motors.mediumB.angle());
        let encC = Math.abs(motors.mediumC.angle());
        //console.log(`encB: ${encB}, encC: ${encC}`);
        //console.sendToScreen();
        advmotctrls.SyncMotorsControl(encB, encC);
        if ((encB + encC) / 2 >= 600) break;
        control.timer1.pauseUntil(10);
    }
    motors.mediumB.stop(); motors.mediumC.stop();
}

function Example52() {
    advmotctrls.SyncConfig(0.02, 25, 50);
    while (true) {
        control.timer1.reset();
        let encB = Math.abs(motors.mediumB.angle());
        let encC = Math.abs(motors.mediumC.angle());
        advmotctrls.SyncMotorsControl(encB, encC);
        if ((encB + encC) / 2 >= 775) break;
        control.timer1.pauseUntil(10);
    }
    motors.mediumB.stop(); motors.mediumC.stop();
}

function Example6() {
    advmotctrls.AccTwoEncConfig(5, 90, 100, 300, 1000);
    advmotctrls.SyncConfig(0.06);
    while (true) {
        control.timer1.reset();
        let encB = motors.mediumB.angle();
        let encC = motors.mediumC.angle();
        let out = advmotctrls.AccTwoEnc(encB, encC);
        advmotctrls.SyncPwrIn(encB, encC, out.pwrOut, out.pwrOut);
        if (out.isDone) break;
        control.timer1.pauseUntil(1);
    }
    motors.mediumB.stop(); motors.mediumC.stop();
}

function Example7() {
    advmotctrls.AccTwoEncConfig(15, 70, 200, 300, 4000);
    advmotctrls.ConfigPD(0.7, 1);
    while (true) {
        control.timer1.reset();
        let encB = motors.mediumB.angle();
        let encC = motors.mediumC.angle();
        let out = advmotctrls.AccTwoEnc(encB, encC);
        let rrcs2 = sensors.color2.light(LightIntensityMode.ReflectedRaw);
        let rrcs3 = sensors.color3.light(LightIntensityMode.ReflectedRaw);
        let rcs2 = GetNormRefValCS(rrcs2, B_REF_RAW_CS2, W_REF_RAW_CS2);
        let rcs3 = GetNormRefValCS(rrcs3, B_REF_RAW_CS3, W_REF_RAW_CS3);
        advmotctrls.PDRegulatorPwrIn(rcs2, rcs3, out.pwrOut);
        if (out.isDone) break;
        control.timer1.pauseUntil(1);
    }
    motors.mediumB.stop(); motors.mediumC.stop();
}

// Функция для нормализации сырых значений с датчика
function GetNormRefValCS(refRawValCS: number, bRefRawValCS: number, wRefRawValCS: number): number {
    let refValCS = Math.map(refRawValCS, bRefRawValCS, wRefRawValCS, 0, 100);
    refValCS = Math.constrain(refValCS, 0, 100);
    return refValCS;
}

const B_REF_RAW_CS2 = 652;
const W_REF_RAW_CS2 = 423;

const B_REF_RAW_CS3 = 640;
const W_REF_RAW_CS3 = 462;

function Main() {
    motors.mediumB.setInverted(true); motors.mediumC.setInverted(false);
    motors.mediumB.setBrake(true); motors.mediumC.setBrake(true);
    motors.mediumB.stop(); motors.mediumC.stop();
    motors.mediumB.clearCounts(); motors.mediumC.clearCounts();
    brick.printString("RUN", 7, 13);
    brick.buttonEnter.pauseUntil(ButtonEvent.Pressed);
    brick.clearScreen();
    MyExample51();
    brick.buttonEnter.pauseUntil(ButtonEvent.Pressed);
}

Main();