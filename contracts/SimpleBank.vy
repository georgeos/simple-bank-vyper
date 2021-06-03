# @notice Simple bank using vyper

event Enrolled:
    accountAddress: indexed(address)

event DepositMade:
    accountAddress: indexed(address)
    value: uint256

event Withdraw:
    accountAddress: indexed(address)
    withdrawAmount: uint256
    newBalance: uint256

userBalances: public(HashMap[address, uint256])
enrolled: public(HashMap[address, bool])
owner: public(address)

# @notice Set the contract creator as the owner
@external
def __init__():
    self.owner = msg.sender

# @notice Get balance
# @return The balance of the user
@external
@view
def balances() -> uint256:
    return self.userBalances[msg.sender]

# @notice Enroll a customer with the bank
# @return The users enrolled status
@external
def enroll() -> bool:
    assert not self.enrolled[msg.sender], "already enrolled"

    self.enrolled[msg.sender] = True
    log Enrolled(msg.sender)
    return True

# @notice Deposit ether into bank
# @return The balance of the user after the deposit is made
@payable
@external
def deposit() -> uint256:
    assert self.enrolled[msg.sender], "not enrolled"

    self.userBalances[msg.sender] += msg.value
    log DepositMade(msg.sender, msg.value)
    return self.userBalances[msg.sender]

# @notice Withdraw ether from bank
# @param withdrawAmount amount you want to withdraw
# @return The balance remaining for the user
@external
def withdraw(withdrawAmount: uint256) -> uint256:
    assert self.enrolled[msg.sender], "not enrolled"
    assert self.userBalances[msg.sender] >= withdrawAmount, "widthdrawAmount too high"

    amount: uint256 = withdrawAmount
    self.userBalances[msg.sender] -= amount
    newBalance: uint256 = self.userBalances[msg.sender]
    send(msg.sender, amount)
    log Withdraw(msg.sender, withdrawAmount, newBalance)
    return newBalance