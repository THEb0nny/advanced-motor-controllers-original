/*
function Example51() {
    motors.mediumB.setInverted(true); motors.mediumC.setInverted(false);
    motors.mediumB.setBrake(true); motors.mediumC.setBrake(true);
    motors.mediumB.clearCounts(); motors.mediumC.clearCounts();
    advmotctrls.Sync_Config(0.02, 50, 50);
    while (true) {
        let encB = motors.mediumB.angle();
        let encC = motors.mediumC.angle();
        let out = advmotctrls.Sync(encB, encC);
        motors.mediumB.run(out[0]); motors.mediumC.run(out[1]);
        if ((encB + encC) / 2 >= 600) break;
    }
    motors.mediumB.stop(); motors.mediumC.stop();
}

function Example52() {
    motors.mediumB.setInverted(true); motors.mediumC.setInverted(false);
    motors.mediumB.setBrake(true); motors.mediumC.setBrake(true);
    motors.mediumB.clearCounts(); motors.mediumC.clearCounts();
    advmotctrls.Sync_Config(0.02, 25, 50);
    while (true) {
        let encB = motors.mediumB.angle();
        let encC = motors.mediumC.angle();
        let out = advmotctrls.Sync(encB, encC);
        motors.mediumB.run(out[0]); motors.mediumC.run(out[1]);
        if ((encB + encC) / 2 >= 600) break;
    }
    motors.mediumB.stop(); motors.mediumC.stop();
}

function Example6() {
    motors.mediumB.setInverted(true); motors.mediumC.setInverted(false);
    motors.mediumB.setBrake(true); motors.mediumC.setBrake(true);
    //motors.mediumB.setRegulated(false); motors.mediumC.setRegulated(false);
    motors.mediumB.clearCounts(); motors.mediumC.clearCounts();
    advmotctrls.AccTwoEnc_Config(15, 90, 300, 300, 1000);
    advmotctrls.PD_Config(0.25, 0.7, 50);
    while (true) {
        let encB = motors.mediumB.angle();
        let encC = motors.mediumC.angle();
        let out = advmotctrls.AccTwoEnc(encB, encC);
        let out2 = advmotctrls.Sync_pwrIn(encB, encC, 0.02, out[0], out[0]);
        motors.mediumB.run(out2[0])
        motors.mediumC.run(out2[1]);
        if (out[1]) break;
    }
    motors.mediumB.stop(); motors.mediumC.stop();
}

function Example7() {
    motors.mediumB.setInverted(true); motors.mediumC.setInverted(false);
    motors.mediumB.setBrake(true); motors.mediumC.setBrake(true);
    motors.mediumB.clearCounts(); motors.mediumC.clearCounts();
    advmotctrls.AccTwoEnc_Config(15, 70, 200, 300, 8000);
    advmotctrls.PD_Config(0.7, 1, 50);
    while (true) {
        control.timer1.reset();
        let encB = motors.mediumB.angle();
        let encC = motors.mediumC.angle();
        let out = advmotctrls.AccTwoEnc(encB, encC);
        let rrcs2 = sensors.color2.light(LightIntensityMode.ReflectedRaw);
        let rrcs3 = sensors.color3.light(LightIntensityMode.ReflectedRaw);
        let rcs2 = GetNormRefValCS(rrcs2, B_REF_RAW_CS2, W_REF_RAW_CS2);
        let rcs3 = GetNormRefValCS(rrcs3, B_REF_RAW_CS3, W_REF_RAW_CS3);
        let out2 = advmotctrls.PD_pwrIn(out[0], rcs2, rcs3);
        motors.mediumB.run(out2[0])
        motors.mediumC.run(out2[1]);
        if (out[1]) break;
        control.timer1.pauseUntil(20);
    }
    motors.mediumB.stop(); motors.mediumC.stop();
}
*/

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
    brick.printString("RUN", 7, 13);
    brick.buttonEnter.pauseUntil(ButtonEvent.Pressed);
    brick.clearScreen();
    //Example7();
}

Main();
