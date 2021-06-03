const SimpleBank = artifacts.require("SimpleBank")

contract("SimpleBank", async (accounts) => {

    owner = accounts[0]
    alice = accounts[1]
    bob = accounts[2]
    deposit = 2 

    it("should return error as not enrolled", async () => {
        const sb = await SimpleBank.deployed()
        try {
            await sb.deposit({from: alice, value: deposit})
        }
        catch (err) {
            assert.equal(err.reason, "not enrolled", "Error message is not correct");
        }
    });

    it("should set constructor value", async () => {
        const sb = await SimpleBank.deployed()

        let result = await sb.owner()
      
        assert.strictEqual(result, accounts[0])
    });
  
     it("mark addresses as enrolled", async () => {
        const sb = await SimpleBank.deployed()
        await sb.enroll({from: alice})

        const aliceEnrolled = await sb.enrolled(accounts[1])
        assert.equal(aliceEnrolled, true, 'enroll balance is incorrect, check balance method or constructor')
  
        const ownerEnrolled = await sb.enrolled(accounts[0])
        assert.equal(ownerEnrolled, false, 'only enrolled users should be marked enrolled')
    })
   
  
     it("should deposit correct amount", async () => {
        const sb = await SimpleBank.deployed()

        await sb.enroll({from: bob})
  
        var tx = await sb.deposit({from: alice, value: deposit})
        const balance = await sb.balances({from: alice})

        assert.equal(deposit.toString(), balance, 'deposit amount incorrect, check deposit method')
  
        const expectedResult = {accountAddress: alice, amount: deposit}

        const logAccountAddress = tx.logs[0].args.accountAddress
        const logDepositAmount = tx.logs[0].args.value

        assert.equal(expectedResult.accountAddress, logAccountAddress, "DepositMade event accountAddress property not emitted, check deposit method")
        assert.equal(expectedResult.amount, logDepositAmount, "DepositMade event amount property not emitted, check deposit method")
    })
  
    it("should withdraw correct amount", async () => {
        const initialAmount = 0
        const sb = await SimpleBank.deployed();

        var tx = await sb.withdraw(deposit, {from: alice})
        const balance = await sb.balances({from: alice})

        assert.equal(balance.toString(), initialAmount.toString(), 'balance incorrect after withdrawal, check withdraw method')

        const accountAddress = tx.logs[0].args.accountAddress
        const newBalance = tx.logs[0].args.newBalance
        const withdrawAmount = tx.logs[0].args.withdrawAmount
  
        const expectedEventResult = {accountAddress: alice, newBalance: initialAmount, withdrawAmount: deposit}
  
        assert.equal(expectedEventResult.accountAddress, accountAddress, "Withdrawal event accountAddress property not emitted, check deposit method")
        assert.equal(expectedEventResult.newBalance, newBalance, "Withdrawal event newBalance property not emitted, check deposit method")
        assert.equal(expectedEventResult.withdrawAmount, withdrawAmount, "Withdrawal event withdrawalAmount property not emitted, check deposit method")
    })
  
  })
