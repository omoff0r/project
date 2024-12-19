// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



contract VotingContract {
    string public greeting = "Building Unstoppable Apps!!!";


    struct Poll {
        string question; 
        string[] options; 
        mapping(uint => uint) voteCounts; 
        mapping(address => bool) hasVoted; 
        uint endTime; 
        bool isActive; 
        address creator; 
    }

    
    Poll[] public polls;


    function createPoll(string memory _question, string[] memory _options, uint _duration) public {
        require(_options.length > 1, "There must be at least two possible answers");
        require(_duration > 0, "The duration must be greater than zero");

        Poll storage newPoll = polls.push();
        newPoll.question = _question;
        newPoll.options = _options;
        newPoll.endTime = block.timestamp + _duration;
        newPoll.isActive = true;
        newPoll.creator = msg.sender;
    }

  
    function vote(uint _pollId, uint _optionIndex) public {
        require(_pollId < polls.length, "Voting with such an ID does not exist");
        Poll storage poll = polls[_pollId];

        require(block.timestamp < poll.endTime, "The voting is completed");
        require(poll.isActive, "Voting is not active");
        require(!poll.hasVoted[msg.sender], "You have already voted");
        require(_optionIndex < poll.options.length, "Invalid option index");

        poll.hasVoted[msg.sender] = true;
        poll.voteCounts[_optionIndex]++;
    }


    function endPoll(uint _pollId) public {
        require(_pollId < polls.length, "Voting with such an ID does not exist");
        Poll storage poll = polls[_pollId];

        require(block.timestamp >= poll.endTime, "Voting is still active");
        require(poll.isActive, "The voting has already been completed");
        require(msg.sender == poll.creator, "Only the creator can complete the voting");

        poll.isActive = false;
    }

    function getResults(uint _pollId) public view returns (string[] memory options, uint[] memory voteCounts) {
        require(_pollId < polls.length, "Voting with such an ID does not exist");
        Poll storage poll = polls[_pollId];

        options = poll.options;
        voteCounts = new uint[](poll.options.length);

        for (uint i = 0; i < poll.options.length; i++) {
            voteCounts[i] = poll.voteCounts[i];
        }
    }

    function getPollCount() public view returns (uint) {
        return polls.length;
    }


    function getPollDetails(uint _pollId) public view returns (
        string memory question,
        string[] memory options,
        uint endTime,
        bool isActive,
        address creator
    ) {
        require(_pollId < polls.length, "Voting with such an ID does not exist");
        Poll storage poll = polls[_pollId];
        return (poll.question, poll.options, poll.endTime, poll.isActive, poll.creator);
    }

    function hasUserVoted(uint _pollId, address _voter) public view returns (bool) {
        require(_pollId < polls.length, "Voting with such an ID does not exist");
        Poll storage poll = polls[_pollId];
        return poll.hasVoted[_voter];
    }
}
