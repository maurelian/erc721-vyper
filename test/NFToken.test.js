const NFToken = artifacts.require('NFToken.vyper');
const assertRevert = require('./helpers/assertRevert');
const TokenReceiverMockVyper = artifacts.require('NFTokenReceiverTestMock.vyper');

contract('NFTokenMock', (accounts) => {
  let nftoken;
  const id1 = 1;
  const id2 = 2;
  const id3 = 3;
  const id4 = 40;

  it('correctly checks all the supported interfaces', async () => {
    nftoken = await NFToken.new([],[], {gas: 6000000});
    const nftokenInterface = await nftoken.supportsInterface('0x80ac58cd');
    const nftokenNonExistingInterface = await nftoken.supportsInterface('0x5b5e139f');
    assert.equal(nftokenInterface, true);
    assert.equal(nftokenNonExistingInterface, false);
  });

  it('returns correct balanceOf after init', async () => {
    nftoken = await NFToken.new([accounts[0]], [id1]);
    const count = await nftoken.balanceOf(accounts[0]);
    assert.equal(count.toNumber(), 1);
  });

  it('finds the correct amount of NFTs owned by account', async () => {
    nftoken = await NFToken.new([accounts[1], accounts[1]], [id2, id3]);
    const count = await nftoken.balanceOf(accounts[1]);
    assert.equal(count.toNumber(), 2);
  });

  it('throws when trying to get count of NFTs owned by 0x0 address', async () => {
    nftoken = await NFToken.new([],[])
    await assertRevert(nftoken.balanceOf('0'));
  });

  it('finds the correct owner of NFToken id', async () => {
    nftoken = await NFToken.new([accounts[1]], [id2]);
    const address = await nftoken.ownerOf(id2);
    assert.equal(address, accounts[1]);
  });

  it('throws when trying to find owner of non-existing NFT id', async () => {
    nftoken = await NFToken.new([],[])
    await assertRevert(nftoken.ownerOf(id4));
  });

  it('correctly approves account', async () => {
    nftoken = await NFToken.new([accounts[0]], [id2]);
    await nftoken.approve(accounts[1], id2);
    const address = await nftoken.getApproved(id2);
    assert.equal(address, accounts[1]);
  });

  it('correctly cancels approval of account[1]', async () => {
    nftoken = await NFToken.new([accounts[0]], [id2]);
    await nftoken.approve(accounts[1], id2);
    await nftoken.approve(0, id2);
    const address = await nftoken.getApproved(id2);
    assert.equal(address, 0);
  });

  it('throws when trying to get approval of non-existing NFT id', async () => {
    await assertRevert(nftoken.getApproved(id4));
  });


  it('throws when trying to approve NFT ID which it does not own', async () => {
    nftoken = await NFToken.new([accounts[1]], [id2]);
    await assertRevert(nftoken.approve(accounts[2], id2, {from: accounts[2]}));
    const address = await nftoken.getApproved(id2);
    assert.equal(address, 0);
  });

  it('throws when trying to approve NFT ID which it already owns', async () => {
    nftoken = await NFToken.new([accounts[1]], [id2]);
    await assertRevert(nftoken.approve(accounts[1], id2));
    const address = await nftoken.getApproved(id2);
    assert.equal(address, 0);
  });

  it('correctly sets an operator', async () => {
    nftoken = await NFToken.new([accounts[0]], [id2]);
    const { logs } = await nftoken.setApprovalForAll(accounts[6], true);
    const approvalForAllEvent = logs.find(e => e.event === 'ApprovalForAll');
    assert.notEqual(approvalForAllEvent, undefined);
    const isApprovedForAll = await nftoken.isApprovedForAll(accounts[0], accounts[6]);
    assert.equal(isApprovedForAll, true);
  });

  it('correctly sets then cancels an operator', async () => {
    nftoken = await NFToken.new([accounts[0]], [id2]);
    await nftoken.setApprovalForAll(accounts[6], true);
    await nftoken.setApprovalForAll(accounts[6], false);

    const isApprovedForAll = await nftoken.isApprovedForAll(accounts[0], accounts[6]);
    assert.equal(isApprovedForAll, false);
  });

  it('throws when trying to set a zero address as operator', async () => {
    await assertRevert(nftoken.setApprovalForAll(0, true));
  });

  it('corectly transfers NFT from owner', async () => {
    const sender = accounts[1];
    const recipient = accounts[2];

    nftoken = await NFToken.new([sender], [id2]);
    const { logs } = await nftoken.transferFrom(sender, recipient, id2, {from: sender});
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const senderBalance = await nftoken.balanceOf(sender);
    const recipientBalance = await nftoken.balanceOf(recipient);
    const ownerOfId2 =  await nftoken.ownerOf(id2);

    assert.equal(senderBalance, 0);
    assert.equal(recipientBalance, 1);
    assert.equal(ownerOfId2, recipient);
  });

  it('corectly transfers NFT from approved address', async () => {
    const sender = accounts[1];
    const recipient = accounts[2];
    const owner = accounts[3];

    nftoken = await NFToken.new([owner], [id2]);
    await nftoken.approve(sender, id2, {from: owner});
    const { logs } = await nftoken.transferFrom(owner, recipient, id2, {from: sender});
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const ownerBalance = await nftoken.balanceOf(owner);
    const recipientBalance = await nftoken.balanceOf(recipient);
    const ownerOfId2 =  await nftoken.ownerOf(id2);

    assert.equal(ownerBalance, 0);
    assert.equal(recipientBalance, 1);
    assert.equal(ownerOfId2, recipient);
  });

  it('corectly transfers NFT as operator', async () => {
    const sender = accounts[1];
    const recipient = accounts[2];
    const owner = accounts[3];

    nftoken = await NFToken.new([owner], [id2]);
    await nftoken.setApprovalForAll(sender, true, {from: owner});
    const { logs } = await nftoken.transferFrom(owner, recipient, id2, {from: sender});
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const ownerBalance = await nftoken.balanceOf(owner);
    const recipientBalance = await nftoken.balanceOf(recipient);
    const ownerOfId2 =  await nftoken.ownerOf(id2);

    assert.equal(ownerBalance, 0);
    assert.equal(recipientBalance, 1);
    assert.equal(ownerOfId2, recipient);
  });

  it('throws when trying to transfer NFT as an address that is not owner, approved or operator', async () => {
    const sender = accounts[1];
    const recipient = accounts[2];
    const owner = accounts[3];

    nftoken = await NFToken.new([owner], [id2]);
    await assertRevert(nftoken.transferFrom(owner, recipient, id2, {from: sender}));
  });

  it('throws when trying to transfer NFT to a zero address', async () => {
    const owner = accounts[3];

    nftoken = await NFToken.new([owner], [id2]);
    await assertRevert(nftoken.transferFrom(owner, 0, id2, {from: owner}));
  });

  it('throws when trying to transfer a invalid NFT', async () => {
    const owner = accounts[3];
    const recipient = accounts[2];

    nftoken = await NFToken.new([owner], [id2]);
    await assertRevert(nftoken.transferFrom(owner, recipient, id3, {from: owner}));
  });

  it('corectly safe transfers NFT from owner', async () => {
    const sender = accounts[1];
    const recipient = accounts[2];

    nftoken = await NFToken.new([sender], [id2]);
    const { logs } = await nftoken.safeTransferFrom(sender, recipient, id2, {from: sender});
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const senderBalance = await nftoken.balanceOf(sender);
    const recipientBalance = await nftoken.balanceOf(recipient);
    const ownerOfId2 =  await nftoken.ownerOf(id2);

    assert.equal(senderBalance, 0);
    assert.equal(recipientBalance, 1);
    assert.equal(ownerOfId2, recipient);
  });

  it('throws when trying to safe transfers NFT from owner to a smart contract', async () => {
    const sender = accounts[1];
    const recipient = nftoken.address;

    nftoken = await NFToken.new([sender], [id2]);
    await assertRevert(nftoken.safeTransferFrom(sender, recipient, id2, {from: sender}));
  });

  it('corectly safe transfers NFT from owner to smart contract that can recieve NFTs', async () => {
    const sender = accounts[1];
    const tokenReceiverMock = await TokenReceiverMockVyper.new();
    const recipient = tokenReceiverMock.address;

    nftoken = await NFToken.new([sender], [id2]);
    const { logs } = await nftoken.safeTransferFrom(sender, recipient, id2, {from: sender});
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const senderBalance = await nftoken.balanceOf(sender);
    const recipientBalance = await nftoken.balanceOf(recipient);
    const ownerOfId2 =  await nftoken.ownerOf(id2);

    assert.equal(senderBalance, 0);
    assert.equal(recipientBalance, 1);
    assert.equal(ownerOfId2, recipient);
  });

    it('throws when trying to safe transfers NFT from owner to a smart contract', async () => {
    const sender = accounts[1];
    const recipient = nftoken.address;

    nftoken = await NFToken.new([sender], [id2]);
    await assertRevert(nftoken.safeTransferFrom(sender, recipient, id2, {from: sender}));
  });

  it('corectly safe transfers NFT from owner to smart contract that can recieve NFTs', async () => {
    const sender = accounts[1];
    const tokenReceiverMock = await TokenReceiverMockVyper.new();
    const recipient = tokenReceiverMock.address;

    nftoken = await NFToken.new([sender], [id2]);
    const { logs } = await nftoken.safeTransferFrom(sender, recipient, id2, {from: sender});
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const senderBalance = await nftoken.balanceOf(sender);
    const recipientBalance = await nftoken.balanceOf(recipient);
    const ownerOfId2 =  await nftoken.ownerOf(id2);

    assert.equal(senderBalance, 0);
    assert.equal(recipientBalance, 1);
    assert.equal(ownerOfId2, recipient);
  });

  it('corectly burns a NFT', async () => {
    nftoken = await NFToken.new([accounts[1]], [id2]);
    const { logs } = await nftoken.burn(accounts[1], id2);
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const balance = await nftoken.balanceOf(accounts[1]);
    assert.equal(balance, 0);

    await assertRevert(nftoken.ownerOf(id2));
  });
});
