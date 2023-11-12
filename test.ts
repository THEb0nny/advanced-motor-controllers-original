function Main() {
    motors.mediumB.setInverted(true);
    motors.mediumB.setBrake(true); motors.mediumC.setBrake(true);
    //motors.mediumB.setRegulated(false); motors.mediumC.setRegulated(false);
    motors.mediumB.clearCounts(); motors.mediumC.clearCounts();
    brick.buttonEnter.pauseUntil(ButtonEvent.Pressed);
    advmotctrls.AccTwoEnc_Config(10, 90, 300, 300, 1000);
    advmotctrls.Sync_Config(0.25, 25, 50);
    while (true) {
        let encB = motors.mediumB.angle();
        let encC = motors.mediumC.angle();
        /*
        let motorsPow = advmotctrls.Sync(encB, encC);
        motors.mediumB.run(motorsPow[0]);
        motors.mediumC.run(motorsPow[1]);
        if ((encB + encC) / 2 >= 600) break;
        */
        let out = advmotctrls.AccTwoEnc(encB, encC);
        motors.mediumB.run(out[0])
        motors.mediumC.run(out[0]);
        if (out[1]) break;
    }
    motors.mediumB.stop();
    motors.mediumC.stop();
}

Main();