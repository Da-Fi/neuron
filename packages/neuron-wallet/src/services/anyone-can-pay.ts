import AddressService from "./addresses"
import SystemScriptInfo from "models/system-script-info"
import AssetAccountInfo from "models/asset-account-info"
import AddressParser from "models/address-parser"
import { TransactionGenerator } from "./tx"
import LiveCellEntity from "database/chain/entities/live-cell"
import { getConnection } from "typeorm"
import Output from "models/chain/output"
import LiveCell from "models/chain/live-cell"
import Transaction from "models/chain/transaction"
import AssetAccountEntity from "database/chain/entities/asset-account"
import { TargetOutputNotFoundError } from "exceptions"
import { AcpSendSameAccountError } from "exceptions"

export default class AnyoneCanPayService {
  public static async generateAnyoneCanPayTx(
    walletID: string,
    targetAddress: string,
    capacityOrAmount: string,
    assetAccountID: number,
    feeRate: string = '0',
    fee: string = '0',
    description?: string,
  ): Promise<Transaction> {
    const assetAccount = await getConnection()
      .getRepository(AssetAccountEntity)
      .createQueryBuilder('aa')
      .where({
        id: assetAccountID,
      })
      .getOne()
    if (!assetAccount) {
      throw new Error(`Asset Account not found!`)
    }
    const tokenID = assetAccount.tokenID

    const targetAnyoneCanPayLockScript = AddressParser.parse(targetAddress)
    if (assetAccount.blake160 === targetAnyoneCanPayLockScript.args) {
      throw new AcpSendSameAccountError()
    }

    const assetAccountInfo = new AssetAccountInfo()
    // verify targetAnyoneCanPay codeHash & hashType
    if (!assetAccountInfo.isAnyoneCanPayScript(targetAnyoneCanPayLockScript)) {
      throw new Error(`Invalid anyone-can-pay lock script address`)
    }

    const isCKB = !tokenID || tokenID === 'CKBytes'

    const allBlake160s = AddressService.allBlake160sByWalletId(walletID)
    const defaultLockHashes: string[] = allBlake160s.map(b => SystemScriptInfo.generateSecpScript(b).computeHash())
    const anyoneCanPayLockHashes: string[] = [assetAccountInfo.generateAnyoneCanPayScript(assetAccount.blake160).computeHash()]

    const typeHash = isCKB ? null : assetAccountInfo.generateSudtScript(tokenID).computeHash()

    // find target output
    const targetOutputEntity: LiveCellEntity | undefined = await getConnection()
      .getRepository(LiveCellEntity)
      .createQueryBuilder('live_cell')
      .where({
        lockHash: Buffer.from(
          targetAnyoneCanPayLockScript.computeHash().slice(2),
          'hex'
        ),
        typeHash: typeHash ? Buffer.from(typeHash.slice(2), 'hex') : null,
        usedBlockNumber: null, // live cells
      })
      .getOne()

    if (!targetOutputEntity) {
      throw new TargetOutputNotFoundError()
    }
    const targetOutputLiveCell: LiveCell = LiveCell.fromEntity(targetOutputEntity)
    const targetOutput: Output = Output.fromObject({
      capacity: targetOutputLiveCell.capacity,
      lock: targetOutputLiveCell.lock(),
      type: targetOutputLiveCell.type(),
      data: targetOutputLiveCell.data,
      outPoint: targetOutputLiveCell.outPoint(),
    })

    const changeBlake160: string = AddressService.nextUnusedChangeAddress(walletID)!.blake160

    const tx = isCKB ? await TransactionGenerator.generateAnyoneCanPayToCKBTx(
      defaultLockHashes,
      anyoneCanPayLockHashes,
      targetOutput,
      capacityOrAmount,
      changeBlake160,
      feeRate,
      fee
    ) : await TransactionGenerator.generateAnyoneCanPayToSudtTx(
      defaultLockHashes,
      anyoneCanPayLockHashes,
      targetOutput,
      capacityOrAmount,
      changeBlake160,
      feeRate,
      fee
    )

    tx.description = description || ''

    return tx
  }
}
