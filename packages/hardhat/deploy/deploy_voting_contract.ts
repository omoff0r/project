import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { VotingContract } from "../typechain-types";

const deployContract: DeployFunction = async (env: HardhatRuntimeEnvironment) => {
  // Получаем аккаунт для развертывания
  const { deployer } = await env.getNamedAccounts();
  
  const { deploy } = env.deployments;

  // Выполняем развертывание контракта VotingContract
  await deploy("VotingContract", {
    from: deployer, 
    args: [],      
    log: true,      
  });


// Экспортируем функцию для использования в командных скриптах Hardhat
export default deployContract;

// Добавляем теги для фильтрации скриптов по меткам
deployContract.tags = ["VotingContract"];
