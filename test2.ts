function MyExample51() {
    advmotctrls2.SyncConfig(30, 30);

    automation.pid1.setGains(0.03, 0, 0.5); // Установка значений регулятору
    automation.pid1.setControlSaturation(-100, 100); // Ограничения ПИДа
    automation.pid1.reset(); // Сброс ПИДа

    let prevTime = 0;
    while (true) {
        control.timer1.reset();
        let currTime = control.millis()
        let loopTime = currTime - prevTime;
        prevTime = currTime;

        const encB = Math.abs(motors.mediumB.angle());
        const encC = Math.abs(motors.mediumC.angle());

        const error = advmotctrls2.GetErrorSyncMotors(encB, encC);
        automation.pid1.setPoint(error);
        const U = automation.pid1.compute(loopTime, 0);
        const powers = advmotctrls2.GetPowerSyncMotors(U);
        motors.mediumB.run(powers.powerLeft);
        motors.mediumC.run(powers.powerRight);

        if ((encB + encC) / 2 >= 600) break;
        control.timer1.pauseUntil(5);
    }
    motors.mediumBC.stop();
}