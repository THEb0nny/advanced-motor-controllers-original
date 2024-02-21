// https://github.com/ofdl-robotics-tw/EV3-CLEV3R-Modules/blob/main/Mods/AdvMtCtrls.bpm
// https://www.youtube.com/watch?v=eOkeyH9nE3o
// https://ofdl.tw/en/ev3-hacking/advanced-motor-controllers-block/

/**
* OFDL Advanced Motor Controller Block module (algorithm part).
* Based 1.1 ver, 2023/09/27.
*/
//% block="AdvMotCtrls" weight=89 color=#02ab38 icon="\uf3fd"
namespace advmotctrls {

    let leftMotor: motors.Motor = motors.mediumB;
    let rightMotor: motors.Motor = motors.mediumC;

    let errOld: number;
    let kp: number;
    let kd: number;
    let pwr: number;

    let syncKp: number;
    let syncVLeft: number;
    let syncVRight: number;
    let syncVLeftSign: number;
    let syncVRightSign: number;

    /*
    let ACC1_minPwr: number;
    let ACC1_maxPwr: number;
    let ACC1_accelDist: number;
    let ACC1_decelDist: number;
    let ACC1_totalDist: number;
    let ACC1_isNEG: number;
    */

    let ACC2_minPwr: number;
    let ACC2_maxPwr: number;
    let ACC2_accelDist: number;
    let ACC2_decelDist: number;
    let ACC2_totalDist: number;
    let ACC2_isNEG: number;

    /**
        Конфигурация ПД регулятора.
        @param kp_in входное значение Kp, eg. 1
        @param kd_in входное значение Kd, eg. 0
    **/
    //% blockId=ConfigPD
    //% block="PD configuration at Kp = $kp_in|Kd = $kd_in"
    export function ConfigPD(kp_in: number, kd_in: number, pwr_in?: number) {
        kp = kp_in;
        kd = kd_in;
        if (pwr_in === undefined) pwr = pwr_in;
        errOld = 0; // Reset prev error PD regulator
    }

    /*
    //% blockId=PDRegulator
    //% block="Chassis control with PD at e1 = $e1|e2 = $e2"
    export function PDRegulator(e1: number, e2: number) {
        const err = e1 - e2;
        const U = err * kp + (err - errOld) * kd;
        const pLeft = pwr + U;
        const pRight = pwr - U;
        leftMotor.run(pLeft);
        rightMotor.run(pRight);
        errOld = err;
    }
    */

    /**
        Блок управляет моторами с установленной скоростью на основе PD регулятора.
        @param e1 входное значение 1 из которого формируется ошибка
        @param e2 входное значение 2 из которого формируется ошибка
        @param pwrIn устанавливается мощность моторов, eg. 50
    **/
    //% blockId=PDRegulatorPwrIn
    //% block="Chassis control with PD at power = $pwrIn|e1 = $e1|e2 = $e2"
    export function PDRegulatorPwrIn(e1: number, e2: number, pwrIn: number) {
        const err = e1 - e2;
        const U = err * kp + (err - errOld) * kd;
        const pLeft = pwrIn + U;
        const pRight = pwrIn - U;
        leftMotor.run(pLeft);
        rightMotor.run(pRight);
        errOld = err;
    }

    /**
        Конфигурация синхронизации шассии.
        @param kp_in входное значение Kp синхронизации, eg. 1
        @param vB_in входное значение мощности левого мотора, eg. 50
        @param vC_in входное значение мощности правого мотора, eg. 50
    **/
    //% blockId=SyncConfig
    //% block="Configuraton sync shassis control Kp = $kp_in|vB = $vB_in|vC = $vC_in"
    export function SyncConfig(kp: number, vLeft?: number, vRight?: number) {
        syncKp = kp;
        if (vLeft === undefined) syncVLeft = vLeft;
        if (vRight === undefined) syncVRight = vRight;
        if (vLeft === undefined) syncVLeftSign = Math.abs(vLeft + 1) - Math.abs(vLeft);
        if (vRight === undefined) syncVRightSign = Math.abs(vRight + 1) - Math.abs(vRight);
    }
    
    /**
        Блок должен управлять моторами синхроннизированно с постоянной скоростью.
        @param eLeft входное значение энкодера левого мотора
        @param eRight входное значение энкодера правого мотора
    **/
    //% blockId=SyncMotorsControl
    //% block="Sync chassis control enc left = $eLeft|enc right = $eRight"
    export function SyncMotorsControl(eLeft: number, eRight: number) {
        const U = ((syncVRight * eLeft) - (syncVLeft * eRight)) * syncKp;
        const pLeft = syncVLeft - syncVRightSign * U;
        const pRight = syncVRight + syncVLeftSign * U;
        leftMotor.run(pLeft);
        rightMotor.run(pRight);
    }

    /**
        Блок должен управлять моторами синхроннизированно с установленной скоростью.
        @param eLeft входное значение энкодера левого мотора
        @param eRight входное значение энкодера правого мотора
        @param vLeft значение скорости левого мотора, eg. 50
        @param vRight значение скорости правого мотора, eg. 50
    **/
    //% blockId=SyncPwrIn
    //% block="Sync chassis control enc left = $eLeft|enc right = $eRight|at speed vLeft = $vLeft|vRight = $vRight"
    export function SyncPwrIn(eLeft: number, eRight: number, vLeft: number, vRight: number) {
        const U = ((vRight * eLeft) - (vLeft * eRight)) * syncKp;
        const pLeft = vLeft - (Math.abs(vRight + 1) - Math.abs(vRight)) * U;
        const pRight = vRight + (Math.abs(vLeft + 1) - Math.abs(vLeft)) * U;
        leftMotor.run(pLeft);
        rightMotor.run(pRight);
    }
    

    /*
    export function AccOneEncConfig(minPwr_in: number, maxPwr_in: number, accelDist_in: number, decelDist_in: number, totalDist_in: number) {
        ACC1_minPwr = Math.abs(minPwr_in);
        ACC1_maxPwr = Math.abs(maxPwr_in);
        ACC1_accelDist = accelDist_in;
        ACC1_decelDist = decelDist_in;
        ACC1_totalDist = totalDist_in;

        if (minPwr_in < 0) ACC1_isNEG = 1;
        else ACC1_isNEG = 0;
    }

    export function AccOneEnc(e1: number, pwrOut: number): boolean {
        let done: boolean;
        let currEnc = Math.abs(e1);
        if (currEnc >= ACC1_totalDist) {
            done = true;
        } else if (currEnc > ACC1_totalDist / 2) {
            if (ACC1_decelDist == 0) {
                pwr = ACC1_maxPwr;
            } else {
                pwr = (ACC1_maxPwr - ACC1_minPwr) / Math.pow(ACC1_decelDist, 2) * Math.pow(currEnc - ACC1_totalDist, 2) + ACC1_minPwr;
            }
            done = false;
        } else {
            if (ACC1_accelDist == 0) {
                pwr = ACC1_maxPwr;
            } else {
                pwr = (ACC1_maxPwr - ACC1_minPwr) / Math.pow(ACC1_accelDist, 2) * Math.pow(currEnc - 0, 2) + ACC1_minPwr;
            }
            done = false;
        }

        if (pwr < ACC1_minPwr) {
            pwr = ACC1_minPwr;
        } else if (pwr > ACC1_maxPwr) {
            pwr = ACC1_maxPwr;
        }

        if (ACC1_isNEG == 1) {
            pwrOut = 0 - pwr;
        } else {
            pwrOut = pwr;
        }
        return done;
    }
    */

    /**
       Конфигурация ускорения и замедления двумя моторами.
       @param minPwr входное значение скорости на старте, eg. 15
       @param maxPwr входное значение максимальной скорости, eg. 50
       @param accelDist значение дистанции ускорения, eg. 150
       @param decelDist значение дистанции замедления, eg. 150
       @param totalDist значение всей дистанции, eg. 500
    **/
    //% blockId=AccTwoEncConfig
    //% block="Accel/deceleration configuration chassis control at minPwr = $minPwr|maxPwr = $maxPwr|accelDist = $accelDist|decelDist = $decelDist|totalDist = $totalDist"
    export function AccTwoEncConfig(minPwr: number, maxPwr: number, accelDist: number, decelDist: number, totalDist: number) {
        ACC2_minPwr = Math.abs(minPwr);
        ACC2_maxPwr = Math.abs(maxPwr);
        ACC2_accelDist = accelDist;
        ACC2_decelDist = decelDist;
        ACC2_totalDist = totalDist;
        if (minPwr < 0) ACC2_isNEG = 1;
        else ACC2_isNEG = 0;
    }

    interface AccTwoEncReturn {
        pwrOut: number;
        isDone: boolean;
    }

    /**
       Конфигурация ускорения и замедления двумя моторами.
       @param minPwr входное значение скорости на старте, eg. 15
       @param maxPwr входное значение максимальной скорости, eg. 50
       @param accelDist значение дистанции ускорения, eg. 150
       @param decelDist значение дистанции замедления, eg. 150
       @param totalDist значение всей дистанции, eg. 500
    **/
    //% blockId=AccTwoEnc
    //% block="Accel/deceleration chassis control compute at encoder left = $eLeft|right = $eRight"
    export function AccTwoEnc(eLeft: number, eRight: number): AccTwoEncReturn {
        let done: boolean;
        let pwrOut: number;
        let currEnc = (Math.abs(eLeft) + Math.abs(eRight)) / 2;
        if (currEnc >= ACC2_totalDist) {
            done = true;
        } else if (currEnc > ACC2_totalDist / 2) {
            if (ACC2_decelDist == 0) {
                pwr = ACC2_maxPwr;
            } else {
                pwr = (ACC2_maxPwr - ACC2_minPwr) / Math.pow(ACC2_decelDist, 2) * Math.pow(currEnc - ACC2_totalDist, 2) + ACC2_minPwr;
            }
            done = false;
        } else {
            if (ACC2_accelDist == 0) {
                pwr = ACC2_maxPwr;
            } else {
                pwr = (ACC2_maxPwr - ACC2_minPwr) / Math.pow(ACC2_accelDist, 2) * Math.pow(currEnc - 0, 2) + ACC2_minPwr;
            }
            done = false;
        }

        if (pwr < ACC2_minPwr) {
            pwr = ACC2_minPwr;
        } else if (pwr > ACC2_maxPwr) {
            pwr = ACC2_maxPwr;
        }

        if (ACC2_isNEG == 1) {
            pwrOut = 0 - pwr;
        } else {
            pwrOut = pwr;
        }

        //return [pwrOut, done];
        return {
            pwrOut: pwrOut,
            isDone: done
        };
    }
}