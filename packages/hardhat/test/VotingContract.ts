import { ethers } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { VotingContract } from "../typechain-types";

describe("votingContract Contract", function () {
  let votingContract: VotingContract;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;

  beforeEach(async () => {
    const votingContractFactory = await ethers.getContractFactory("VotingContract");
    votingContract = await votingContractFactory.deploy();
    await votingContract.waitForDeployment();

    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("Создание голосования", async () => {
    const options = ["Option 1", "Option 2"];
    await votingContract.createPoll("Test Question", options, 3600);

    const poll = await votingContract.getPollDetails(0);
    expect(poll.question).to.equal("Test Question");
    expect(poll.options).to.deep.equal(options);
    expect(poll.isActive).to.equal(true);
    expect(poll.creator).to.equal(owner.address);
  });

  it("Не дал создать опрос с менее чем двумя вариантами", async () => {
    await expect(votingContract.createPoll("Test Question", ["Option 1"], 3600)).to.be.revertedWith(
      "There must be at least two possible answers",
    );
  });

  it("Дал право пользователю на голос", async () => {
    await votingContract.createPoll("Test Question", ["Option 1", "Option 2"], 3600);

    await votingContract.connect(addr1).vote(0, 0);
    const hasVoted = await votingContract.hasUserVoted(0, addr1.address);
    expect(hasVoted).to.equal(true);
  });

  it("Предотвратил дублирование голосование", async () => {
    await votingContract.createPoll("Test Question", ["Option 1", "Option 2"], 3600);

    await votingContract.connect(addr1).vote(0, 0);
    await expect(votingContract.connect(addr1).vote(0, 0)).to.be.revertedWith("You have already voted");
  });

  it("Дал право закончить голосование только создателю", async () => {
    await votingContract.createPoll("Test Question", ["Option 1", "Option 2"], 1);

    // Forward time to ensure poll can be ended
    await ethers.provider.send("evm_increaseTime", [2]);
    await ethers.provider.send("evm_mine", []);

    await votingContract.endPoll(0);
    const poll = await votingContract.getPollDetails(0);
    expect(poll.isActive).to.equal(false);
  });

  it("Вернул результат голосования верно", async () => {
    await votingContract.createPoll("Test Question", ["Option 1", "Option 2"], 3600);
    await votingContract.connect(addr1).vote(0, 0);
    await votingContract.connect(addr2).vote(0, 1);

    // Forward time to ensure poll can be ended
    await ethers.provider.send("evm_increaseTime", [3600]);
    await ethers.provider.send("evm_mine", []);

    await votingContract.endPoll(0);

    const results = await votingContract.getResults(0);
    expect(results.voteCounts[0]).to.equal(1n);
    expect(results.voteCounts[1]).to.equal(1n);
  });
});
