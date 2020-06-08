import TransactionsService, { SearchType } from '../../src/services/tx/transaction-service'

describe('transactions service', () => {
  describe('filterSearchType', () => {
    it('ckt prefix', () => {
      const address = 'ckt1qyqrdsefa43s6m882pcj53m4gdnj4k440axqswmu83'
      const type = TransactionsService.filterSearchType(address)
      expect(type).toBe(SearchType.Address)
    })

    it('ckb prefix', () => {
      const address = 'ckb1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf'
      const type = TransactionsService.filterSearchType(address)
      expect(type).toBe(SearchType.Address)
    })

    it('0x prefix', () => {
      const hash = '0x01831733c1b46f461fb49007f8b99449bc40cfdfd0e249da23f178a37139e1a1'
      const type = TransactionsService.filterSearchType(hash)
      expect(type).toBe(SearchType.TxHash)
    })

    it('2019-02-18', () => {
      const date = '2019-02-18'
      const type = TransactionsService.filterSearchType(date)
      expect(type).toBe(SearchType.Date)
    })

    it('-', () => {
      const value = '-'
      const type = TransactionsService.filterSearchType(value)
      expect(type).toBe(SearchType.TokenInfo)
    })

    it('empty string', () => {
      const value = ''
      const type = TransactionsService.filterSearchType(value)
      expect(type).toBe(SearchType.Empty)
    })

    it('2019-2-18', () => {
      const value = '2019-2-18'
      const type = TransactionsService.filterSearchType(value)
      expect(type).toBe(SearchType.TokenInfo)
    })
  })
})
