// https://github.com/ofdl-robotics-tw/EV3-CLEV3R-Modules/blob/main/Mods/AdvMtCtrls.bpm
// https://www.youtube.com/watch?v=eOkeyH9nE3o
// https://ofdl.tw/en/ev3-hacking/advanced-motor-controllers-block/

/**
* OFDL Advanced Motor Controller Block module (algorithm part).
* Based 1.1 ver, 2023/09/27.
*/
//% block="AdvMotCtrls" weight=89 color=#02ab38 icon="\uf3fd"
namespace advmotctrls {
    
    enum PowerMot {
        pB,
        pC
    }

    export class AdvMotCtrls {

        private err_old: number;
        private kp: number;
        private kd: number;
        private pB: number;
        private pC: number;

        private sync_kp: number;
        private sync_vB: number;
        private sync_vC: number;
        private sync_vBsign: number;
        private sync_vCsign: number;

        private ACC_minPwr: number;
        private ACC_maxPwr: number;
        private ACC_accelDist: number;
        private ACC_decelDist: number;
        private ACC_totalDist: number;
        private ACC_isNEG: number;

        constructor() {

        }

        //% block
        public PD_Config(kp_in: number, kd_in: number) {
            this.kp = kp_in;
            this.kd = kd_in;
            this.err_old = 0;
        }

        //% block
        public PD_pwrIn(pwrIn: number, e1: number, e2: number) {
            let err = e1 - e2;
            let U = err * this.kp + (err - this.err_old) * this.kd;
            this.pB = pwrIn + U;
            this.pC = pwrIn - U;
            this.err_old = err;
        }

        //% block
        public PD_getPWR(powerMot: PowerMot): number {
            return (powerMot == PowerMot.pB ? this.pB : this.pC);
        }

        //% block
        public Sync_Config(kp_in: number, vB_in: number, vC_in: number) {
            this.sync_kp = kp_in;
            this.sync_vB = vB_in;
            this.sync_vC = vC_in;
            this.sync_vBsign = Math.abs(vB_in + 1) - Math.abs(vB_in);
            this.sync_vCsign = Math.abs(vC_in + 1) - Math.abs(vC_in);
        }

        // Блок должен управлять моторами синхроннизированно с постоянной скоростью
        //% block
        public Sync(eB: number, eC: number) {
            let U = ((this.sync_vC * eB) - (this.sync_vB * eC)) * this.sync_kp;
            this.pB = this.sync_vB - this.sync_vCsign * U;
            this.pC = this.sync_vC + this.sync_vBsign * U;
            motors.mediumB.run(this.pB);
            motors.mediumC.run(this.pC);
        }

        // Блок должен управлять моторами синхроннизированно
        //% block
        public Sync_pwrIn(eB: number, eC: number, S_KP: number, vB: number, vC: number) {
            let U = ((vC * eB) - (vB * eC)) * S_KP;
            this.pB = vB - (Math.abs(vC + 1) - Math.abs(vC)) * U;
            this.pC = vC + (Math.abs(vB + 1) - Math.abs(vB)) * U;
            motors.mediumB.run(this.pB);
            motors.mediumC.run(this.pC);
        }

    }

    export const AdvencedMotorCtrls = new AdvMotCtrls();

    /*
    let err_old: number;
    let kp: number;
    let kd: number;
    let pwr: number;

    let sync_kp: number;
    let sync_vB: number;
    let sync_vC: number;
    let sync_vBsign: number;
    let sync_vCsign: number;

    let ACC1_minPwr: number;
    let ACC1_maxPwr: number;
    let ACC1_accelDist: number;
    let ACC1_decelDist: number;
    let ACC1_totalDist: number;
    let ACC1_isNEG: number;

    let ACC2_minPwr: number;
    let ACC2_maxPwr: number;
    let ACC2_accelDist: number;
    let ACC2_decelDist: number;
    let ACC2_totalDist: number;
    let ACC2_isNEG: number;

    //% block
    export function PD_Config(kp_in: number, kd_in: number, pwr_in: number) {
        kp = kp_in;
        kd = kd_in;
        pwr = pwr_in;
        err_old = 0;
    }

    //% block
    export function PD(e1: number, e2: number): number[] {
        let err = e1 - e2;
        let U = err * kp + (err - err_old) * kd;
        let pB = pwr + U;
        let pC = pwr - U;
        err_old = err;
        return [pB, pC];
    }

    //% block
    export function PD_pwrIn(pwrIn: number, e1: number, e2: number): number[] {
        let err = e1 - e2;
        let U = err * kp + (err - err_old) * kd;
        let pB = pwrIn + U;
        let pC = pwrIn - U;
        err_old = err;
        return [pB, pC];
    }

    //% block
    export function Sync_Config(kp_in: number, vB_in: number, vC_in: number) {
        sync_kp = kp_in;
        sync_vB = vB_in;
        sync_vC = vC_in;
        sync_vBsign = Math.abs(vB_in + 1) - Math.abs(vB_in);
        sync_vCsign = Math.abs(vC_in + 1) - Math.abs(vC_in);
    }

    //% block
    export function Sync(eB: number, eC: number): number[] {
        let U = ((sync_vC * eB) - (sync_vB * eC)) * sync_kp;
        let pB = sync_vB - sync_vCsign * U;
        let pC = sync_vC + sync_vBsign * U;
        return [pB, pC];
    }

    //% block
    export function Sync_pwrIn(eB: number, eC: number, S_KP: number, vB: number, vC: number): number[] {
        let U = ((vC * eB) - (vB * eC)) * S_KP;
        let pB = vB - (Math.abs(vC + 1) - Math.abs(vC)) * U;
        let pC = vC + (Math.abs(vB + 1) - Math.abs(vB)) * U;
        return [pB, pC];
    }

    //% block
    export function AccOneEnc_Config(minPwr_in: number, maxPwr_in: number, accelDist_in: number, decelDist_in: number, totalDist_in: number) {
        ACC1_minPwr = Math.abs(minPwr_in);
        ACC1_maxPwr = Math.abs(maxPwr_in);
        ACC1_accelDist = accelDist_in;
        ACC1_decelDist = decelDist_in;
        ACC1_totalDist = totalDist_in;

        if (minPwr_in < 0) ACC1_isNEG = 1;
        else ACC1_isNEG = 0;
    }

    //% block
    export function AccTwoEnc_Config(minPwr_in: number, maxPwr_in: number, accelDist_in: number, decelDist_in: number, totalDist_in: number) {
        ACC2_minPwr = Math.abs(minPwr_in);
        ACC2_maxPwr = Math.abs(maxPwr_in);
        ACC2_accelDist = accelDist_in;
        ACC2_decelDist = decelDist_in;
        ACC2_totalDist = totalDist_in;

        if (minPwr_in < 0) ACC2_isNEG = 1;
        else ACC2_isNEG = 0;
    }

    //% block
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

    //% block
    export function AccTwoEnc(e1: number, e2: number): any[] {
        let done: boolean;
        let pwrOut: number;
        let currEnc = (Math.abs(e1) + Math.abs(e2)) / 2;
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
        return [pwrOut, done];
    }
    */
}