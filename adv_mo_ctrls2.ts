/**
* OFDL Advanced Motor Controller Block module (algorithm part).
* Based 1.1 ver, 2023/09/27.
*/
//% block="AdvMotCtrls"
namespace advmotctrls2 {

    let pwr: number;

    let syncVLeft: number;
    let syncVRight: number;
    let syncVLeftSign: number;
    let syncVRightSign: number;

    /**
        Конфигурация синхронизации шассии.
        @param kp_in входное значение Kp синхронизации, eg. 1
        @param vB_in входное значение мощности левого мотора, eg. 50
        @param vC_in входное значение мощности правого мотора, eg. 50
    **/
    //% blockId=SyncConfig
    //% block="Configuraton sync shassis control Kp = $kp_in|vB = $vB_in|vC = $vC_in"
    export function SyncConfig(vLeft: number, vRight: number) {
        syncVLeft = vLeft;
        syncVRight = vRight;
        syncVLeftSign = Math.abs(vLeft + 1) - Math.abs(vLeft);
        syncVRightSign = Math.abs(vRight + 1) - Math.abs(vRight);
    }

    //% blockId=GetErrorSyncMotors
    export function GetErrorSyncMotors(eLeft: number, eRight: number): number {
        return ((syncVRight * eLeft) - (syncVLeft * eRight));
    }

    interface MotorsPower {
        powerLeft: number;
        powerRight: number;
    }

    //% blockId=GetPowerSyncMotors
    export function GetPowerSyncMotors(U: number): MotorsPower {
        const pLeft = syncVLeft - syncVRightSign * U;
        const pRight = syncVRight + syncVLeftSign * U;
        return {
            powerLeft: pLeft,
            powerRight: pRight
        };
    }

}